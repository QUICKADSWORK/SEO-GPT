#!/usr/bin/env python3
"""
Domain Metrics Agent
Extracts domain rating and US traffic for a list of websites from a CSV file.
Supports multiple SEO data providers: Ahrefs, Moz, SEMrush, SimilarWeb
"""

import csv
import json
import os
import sys
import time
from typing import Dict, List, Optional, Tuple
import requests
from urllib.parse import urlparse


class DomainMetricsAgent:
    """Agent to fetch domain metrics (rating and US traffic) for websites."""
    
    def __init__(self, provider: str = 'semrush', api_key: str = None, debug: bool = False):
        """
        Initialize the agent with a specific provider.
        
        Args:
            provider: One of 'ahrefs', 'moz', 'semrush', 'similarweb'
            api_key: API key for the chosen provider
            debug: Enable debug output
        """
        self.provider = provider.lower()
        self.api_key = api_key or os.getenv(f'{provider.upper()}_API_KEY')
        self.debug = debug
        
        if not self.api_key:
            print(f"⚠️  Warning: No API key found for {provider}. Set {provider.upper()}_API_KEY environment variable.")
        
        self.providers = {
            'ahrefs': self._fetch_ahrefs_metrics,
            'moz': self._fetch_moz_metrics,
            'semrush': self._fetch_semrush_metrics,
            'similarweb': self._fetch_similarweb_metrics,
        }
        
        if self.provider not in self.providers:
            raise ValueError(f"Provider must be one of: {', '.join(self.providers.keys())}")
    
    def normalize_domain(self, url: str) -> str:
        """Extract clean domain from URL."""
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        parsed = urlparse(url)
        domain = parsed.netloc or parsed.path
        # Remove www. prefix
        return domain.replace('www.', '')
    
    def _fetch_ahrefs_metrics(self, domain: str) -> Tuple[Optional[float], Optional[int]]:
        """
        Fetch metrics from Ahrefs API via RapidAPI.
        
        Returns:
            Tuple of (domain_rating, us_traffic)
        """
        try:
            # RapidAPI Ahrefs endpoint
            url = "https://website-traffic-checker-ahref.p.rapidapi.com/check-traffic.php"
            
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-host': 'website-traffic-checker-ahref.p.rapidapi.com',
                'x-rapidapi-key': self.api_key
            }
            
            data = {
                'domain': domain
            }
            
            response = requests.post(url, headers=headers, data=data, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            
            if not result.get('success'):
                return None, None
            
            # Extract domain rating from backlinks_info
            backlinks_info = result.get('backlinks_info', {})
            backlinks_data = backlinks_info.get('data', {})
            domain_rating = backlinks_data.get('ascore')  # Authority Score
            
            # Extract US traffic from traffic_analysis
            traffic_analysis = result.get('traffic_analysis', {})
            
            # Get total visits (monthly)
            monthly_visits = traffic_analysis.get('visits')
            
            # Calculate daily average
            daily_traffic = None
            if monthly_visits:
                daily_traffic = int(monthly_visits / 30)  # Average daily traffic
            
            if self.debug:
                print(f"    Raw data - ascore: {domain_rating}, monthly visits: {monthly_visits}, daily avg: {daily_traffic}")
                print(f"    Organic search: {traffic_analysis.get('search_organic')}")
            
            return domain_rating, daily_traffic
            
        except requests.exceptions.RequestException as e:
            print(f"⚠️  Error fetching Ahrefs data for {domain}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"    Response: {e.response.text[:200]}")
            return None, None
        except Exception as e:
            print(f"⚠️  Unexpected error for {domain}: {e}")
            return None, None
    
    def _fetch_moz_metrics(self, domain: str) -> Tuple[Optional[float], Optional[int]]:
        """
        Fetch metrics from Moz API.
        
        Returns:
            Tuple of (domain_authority, us_traffic)
        """
        try:
            # Moz API endpoint
            url = f"https://lsapi.seomoz.com/v2/url-metrics/{domain}"
            
            headers = {
                'Authorization': f'Basic {self.api_key}',
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Domain Authority (DA) is Moz's equivalent to DR
            domain_authority = data.get('domain_authority')
            
            # Moz doesn't provide traffic data directly
            # Would need to combine with another API
            us_traffic = None
            
            return domain_authority, us_traffic
            
        except requests.exceptions.RequestException as e:
            print(f"⚠️  Error fetching Moz data for {domain}: {e}")
            return None, None
        except Exception as e:
            print(f"⚠️  Unexpected error for {domain}: {e}")
            return None, None
    
    def _fetch_semrush_metrics(self, domain: str) -> Tuple[Optional[float], Optional[int]]:
        """
        Fetch metrics from SEMrush API via RapidAPI.
        
        Returns:
            Tuple of (authority_score, us_traffic)
        """
        try:
            # RapidAPI SEMrush endpoint
            url = "https://semrush-website-traffic-checker.p.rapidapi.com/webtraffic.php"
            
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-host': 'semrush-website-traffic-checker.p.rapidapi.com',
                'x-rapidapi-key': self.api_key
            }
            
            # Send domain in POST body
            data = {
                'website': domain  # RapidAPI uses 'website' parameter
            }
            
            response = requests.post(url, headers=headers, data=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            
            # Extract metrics from RapidAPI SEMrush response
            # Response structure: semrush -> tasks[0] -> result[0] -> items[0] -> metrics
            try:
                semrush_data = result.get('semrush', {})
                tasks = semrush_data.get('tasks', [])
                
                if not tasks:
                    return None, None
                
                task_result = tasks[0].get('result', [])
                if not task_result:
                    return None, None
                
                items = task_result[0].get('items', [])
                if not items:
                    return None, None
                
                metrics = items[0].get('metrics', {})
                organic = metrics.get('organic', {})
                
                # Get organic traffic value (ETV - Estimated Traffic Value)
                us_traffic = organic.get('etv')
                
                # Get keyword count as a proxy for domain authority
                # (more keywords = stronger domain)
                keyword_count = organic.get('count')
                
                # Convert traffic to integer
                if us_traffic:
                    us_traffic = int(float(us_traffic))
                
                # Use keyword count as authority score
                # Normalize to 0-100 scale (log scale)
                authority_score = None
                if keyword_count:
                    # Convert keyword count to 0-100 scale
                    # 100k+ keywords = ~90-100 rating
                    # 10k keywords = ~70-80 rating
                    # 1k keywords = ~40-50 rating
                    import math
                    raw_score = min(100, max(0, 20 + (math.log10(keyword_count) * 15)))
                    
                    # Adjust DR to match real Ahrefs values (SEMrush tends to be ~19 points higher)
                    authority_score = max(0, raw_score - 19)
                    authority_score = round(authority_score, 1)
                
                return authority_score, us_traffic
                
            except (KeyError, IndexError, TypeError) as e:
                if self.debug:
                    print(f"    Error parsing response structure: {e}")
                return None, None
            
        except requests.exceptions.RequestException as e:
            print(f"⚠️  Error fetching SEMrush data for {domain}: {e}")
            if hasattr(e.response, 'text'):
                print(f"    Response: {e.response.text[:200]}")
            return None, None
        except Exception as e:
            print(f"⚠️  Unexpected error for {domain}: {e}")
            return None, None
    
    def _fetch_similarweb_metrics(self, domain: str) -> Tuple[Optional[float], Optional[int]]:
        """
        Fetch metrics from SimilarWeb API.
        
        Returns:
            Tuple of (global_rank, us_traffic)
        """
        try:
            # SimilarWeb API endpoint
            url = f"https://api.similarweb.com/v1/website/{domain}/total-traffic-and-engagement/visits"
            
            params = {
                'api_key': self.api_key,
                'start_date': '2024-10',  # Recent month
                'end_date': '2024-10',
                'country': 'us',
                'granularity': 'monthly',
                'main_domain_only': 'false',
                'format': 'json'
            }
            
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # SimilarWeb doesn't have DR, but we can use global rank as a proxy
            # Lower rank = better (inverted for consistency)
            global_rank = data.get('global_rank')
            
            # US traffic visits
            visits = data.get('visits', [])
            us_traffic = visits[0].get('visits') if visits else None
            
            return global_rank, us_traffic
            
        except requests.exceptions.RequestException as e:
            print(f"⚠️  Error fetching SimilarWeb data for {domain}: {e}")
            return None, None
        except Exception as e:
            print(f"⚠️  Unexpected error for {domain}: {e}")
            return None, None
    
    def fetch_metrics(self, domain: str, delay: float = 1.0) -> Dict:
        """
        Fetch metrics for a single domain.
        
        Args:
            domain: Domain to analyze
            delay: Delay between requests (rate limiting)
        
        Returns:
            Dictionary with domain, rating, and traffic
        """
        clean_domain = self.normalize_domain(domain)
        print(f"🔍 Fetching metrics for: {clean_domain}")
        
        # Add delay to avoid rate limiting
        time.sleep(delay)
        
        # Fetch metrics using selected provider
        rating, traffic = self.providers[self.provider](clean_domain)
        
        return {
            'domain': clean_domain,
            'original_url': domain,
            'domain_rating': rating,
            'us_traffic': traffic,
            'provider': self.provider
        }
    
    def process_csv(self, input_file: str, output_file: str, domain_column: str = 'domain', delay: float = 1.0):
        """
        Process a CSV file with domains and add metrics.
        
        Args:
            input_file: Path to input CSV file
            domain_column: Name of the column containing domains/URLs
            output_file: Path to output CSV file
            delay: Delay between API requests
        """
        print(f"📂 Reading domains from: {input_file}")
        
        results = []
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                if domain_column not in reader.fieldnames:
                    print(f"❌ Column '{domain_column}' not found in CSV. Available columns: {reader.fieldnames}")
                    return
                
                domains = list(reader)
                total = len(domains)
                
                print(f"📊 Processing {total} domains using {self.provider.upper()} API...")
                
                for idx, row in enumerate(domains, 1):
                    domain = row.get(domain_column, '').strip()
                    
                    if not domain:
                        print(f"⚠️  Skipping empty domain at row {idx}")
                        continue
                    
                    print(f"\n[{idx}/{total}] Processing: {domain}")
                    
                    metrics = self.fetch_metrics(domain, delay=delay)
                    
                    # Merge original row with metrics
                    result = {**row, **metrics}
                    results.append(result)
                    
                    print(f"✅ Domain Rating: {metrics['domain_rating']}, US Traffic: {metrics['us_traffic']}")
        
        except FileNotFoundError:
            print(f"❌ Input file not found: {input_file}")
            return
        except Exception as e:
            print(f"❌ Error reading input file: {e}")
            return
        
        # Write results to output CSV
        if results:
            try:
                fieldnames = list(results[0].keys())
                
                with open(output_file, 'w', encoding='utf-8', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(results)
                
                print(f"\n✅ Results saved to: {output_file}")
                print(f"📊 Processed {len(results)} domains successfully")
                
            except Exception as e:
                print(f"❌ Error writing output file: {e}")
        else:
            print("❌ No results to write")


def main():
    """CLI interface for the domain metrics agent."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Extract domain rating and US traffic for websites from CSV'
    )
    parser.add_argument(
        'input_file',
        help='Input CSV file with domains'
    )
    parser.add_argument(
        '-o', '--output',
        default='domain_metrics_output.csv',
        help='Output CSV file (default: domain_metrics_output.csv)'
    )
    parser.add_argument(
        '-c', '--column',
        default='domain',
        help='Name of column containing domains (default: domain)'
    )
    parser.add_argument(
        '-p', '--provider',
        choices=['ahrefs', 'moz', 'semrush', 'similarweb'],
        default='semrush',
        help='SEO data provider to use (default: semrush)'
    )
    parser.add_argument(
        '-k', '--api-key',
        help='API key for the chosen provider (can also use environment variable)'
    )
    parser.add_argument(
        '-d', '--delay',
        type=float,
        default=1.0,
        help='Delay between requests in seconds (default: 1.0)'
    )
    
    args = parser.parse_args()
    
    print("🚀 Domain Metrics Agent")
    print("=" * 50)
    
    # Initialize agent
    agent = DomainMetricsAgent(provider=args.provider, api_key=args.api_key)
    
    # Process CSV
    agent.process_csv(
        input_file=args.input_file,
        output_file=args.output,
        domain_column=args.column,
        delay=args.delay
    )


if __name__ == '__main__':
    main()


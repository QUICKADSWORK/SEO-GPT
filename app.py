#!/usr/bin/env python3
"""
Domain Metrics Web App
Beautiful UI for checking domain rating and US traffic
"""

from flask import Flask, render_template, request, jsonify, send_file
from domain_metrics_agent import DomainMetricsAgent
import csv
import io
import os
from datetime import datetime

app = Flask(__name__)

# Get RapidAPI key from environment variable or use default
RAPIDAPI_KEY = os.getenv('SEMRUSH_API_KEY') or os.getenv('RAPIDAPI_KEY') or "56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae"

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze domains and return metrics"""
    try:
        data = request.get_json()
        domains_input = data.get('domains', '')
        
        # Parse domains (split by newlines, commas, or spaces)
        domains = []
        for line in domains_input.split('\n'):
            line = line.strip()
            if line:
                # Split by comma or space
                parts = line.replace(',', ' ').split()
                domains.extend([d.strip() for d in parts if d.strip()])
        
        if not domains:
            return jsonify({'error': 'No domains provided'}), 400
        
        # Limit to 20 domains at once
        if len(domains) > 20:
            return jsonify({'error': 'Maximum 20 domains allowed at once'}), 400
        
        # Initialize agent with SEMrush
        agent = DomainMetricsAgent(provider='semrush', api_key=RAPIDAPI_KEY)
        
        # Fetch metrics for each domain
        results = []
        for idx, domain in enumerate(domains):
            try:
                metrics = agent.fetch_metrics(domain, delay=1.0)
                results.append({
                    'domain': metrics['domain'],
                    'domain_rating': metrics['domain_rating'],
                    'us_traffic': metrics['us_traffic'],
                    'status': 'success'
                })
            except Exception as e:
                results.append({
                    'domain': domain,
                    'domain_rating': None,
                    'us_traffic': None,
                    'status': 'error',
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'total': len(results)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/export', methods=['POST'])
def export():
    """Export results as CSV"""
    try:
        data = request.get_json()
        results = data.get('results', [])
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=['domain', 'domain_rating', 'us_traffic', 'provider'])
        writer.writeheader()
        
        for result in results:
            if result.get('status') == 'success':
                writer.writerow({
                    'domain': result['domain'],
                    'domain_rating': result['domain_rating'],
                    'us_traffic': result['us_traffic'],
                    'provider': 'semrush'
                })
        
        # Create file-like object for download
        output.seek(0)
        filename = f"domain_metrics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


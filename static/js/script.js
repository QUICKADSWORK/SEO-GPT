let currentResults = [];

function loadExample() {
    const exampleDomains = `stripe.com
shopify.com
salesforce.com
quickads.ai
zenskar.com`;
    document.getElementById('domainsInput').value = exampleDomains;
}

function clearInput() {
    document.getElementById('domainsInput').value = '';
    document.getElementById('resultsSection').style.display = 'none';
}

function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString('en-US');
}

function getDRBadgeClass(dr) {
    if (dr === null || dr === undefined) return 'dr-low';
    if (dr >= 60) return 'dr-high';
    if (dr >= 30) return 'dr-medium';
    return 'dr-low';
}

async function analyzeDomains() {
    const input = document.getElementById('domainsInput').value.trim();
    
    if (!input) {
        alert('Please enter at least one domain');
        return;
    }
    
    // Disable button and show loader
    const btn = document.getElementById('analyzeBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    btn.disabled = true;
    btnText.textContent = 'Analyzing...';
    btnLoader.style.display = 'inline-block';
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ domains: input })
        });
        
        const data = await response.json();
        
        if (data.error) {
            alert('Error: ' + data.error);
            return;
        }
        
        currentResults = data.results;
        displayResults(data.results);
        
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        // Re-enable button
        btn.disabled = false;
        btnText.textContent = '🚀 Analyze Domains';
        btnLoader.style.display = 'none';
    }
}

function displayResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');
    const resultsStats = document.getElementById('resultsStats');
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Calculate stats
    const successCount = results.filter(r => r.status === 'success').length;
    const avgDR = results
        .filter(r => r.status === 'success' && r.domain_rating)
        .reduce((sum, r) => sum + r.domain_rating, 0) / successCount || 0;
    const totalTraffic = results
        .filter(r => r.status === 'success' && r.us_traffic)
        .reduce((sum, r) => sum + r.us_traffic, 0);
    
    // Display stats
    resultsStats.innerHTML = `
        <strong>${successCount}/${results.length}</strong> domains analyzed successfully • 
        Avg DR: <strong>${avgDR.toFixed(1)}</strong> • 
        Total Traffic: <strong>${formatNumber(totalTraffic)}</strong> visits/month
    `;
    
    // Clear and populate table
    resultsBody.innerHTML = '';
    
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        const instagramName = result.instagram_display_name || 'N/A';
        const adCounts = result.ad_counts || {};
        const totalAds = formatNumber(adCounts.total);
        const activeAds = formatNumber(adCounts.active);
        const inactiveAds = formatNumber(adCounts.inactive);

        if (result.status === 'success') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${result.domain}</strong></td>
                <td>
                    <span class="dr-badge ${getDRBadgeClass(result.domain_rating)}">
                        ${result.domain_rating !== null && result.domain_rating !== undefined ? result.domain_rating.toFixed(1) : 'N/A'}
                    </span>
                </td>
                <td class="traffic-value">${formatNumber(result.us_traffic)}</td>
                <td>${instagramName}</td>
                <td>${totalAds}</td>
                <td>${activeAds}</td>
                <td>${inactiveAds}</td>
                <td class="status-success">✓ Success</td>
            `;
        } else {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${result.domain}</strong></td>
                <td>-</td>
                <td>-</td>
                <td>${instagramName}</td>
                <td>${totalAds}</td>
                <td>${activeAds}</td>
                <td>${inactiveAds}</td>
                <td class="status-error">✗ Error</td>
            `;
        }

        resultsBody.appendChild(row);
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

async function exportResults() {
    if (currentResults.length === 0) {
        alert('No results to export');
        return;
    }
    
    try {
        const response = await fetch('/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ results: currentResults })
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `domain_metrics_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        alert('Error exporting results: ' + error.message);
    }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('domainsInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            analyzeDomains();
        }
    });
});


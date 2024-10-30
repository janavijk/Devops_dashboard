<!-- templates/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevOps Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <h1 class="mt-5">DevOps Dashboard</h1>
        <canvas id="containerChart" width="400" height="200"></canvas>
        <div id="systemHealth" class="mt-5"></div>
    </div>

    <script>
        async function fetchContainers() {
            const response = await fetch('/api/containers');
            return response.json();
        }

        async function fetchSystemHealth() {
            const response = await fetch('/api/system');
            return response.json();
        }

        async function updateDashboard() {
            const containers = await fetchContainers();
            const systemHealth = await fetchSystemHealth();

            // Update Container Chart
            const ctx = document.getElementById('containerChart').getContext('2d');
            const labels = containers.map(c => c.name);
            const data = containers.map(c => c.cpu_usage);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'CPU Usage',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Update System Health
            document.getElementById('systemHealth').innerHTML = `
                <h5>System Health</h5>
                <p>CPU Usage: ${systemHealth.cpu_usage}%</p>
                <p>Memory Usage: ${systemHealth.memory_usage}%</p>
            `;
        }

        setInterval(updateDashboard, 5000);
        updateDashboard();
    </script>
</body>
</html>

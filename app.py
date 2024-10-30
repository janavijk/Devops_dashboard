# app.py
from flask import Flask, render_template, jsonify
from flask_cors import CORS
import docker
import psutil  # For system health

app = Flask(__name__)
CORS(app)

# Initialize Docker client
client = docker.from_env()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/containers')
def get_containers():
    containers = client.containers.list()
    container_data = [
        {
            'id': container.id,
            'name': container.name,
            'status': container.status,
            'cpu_usage': container.stats(stream=False)['cpu_stats']['cpu_usage']['total_usage'],
            'memory_usage': container.stats(stream=False)['memory_stats']['usage'],
        } for container in containers
    ]
    return jsonify(container_data)

@app.route('/api/system')
def get_system_health():
    cpu_usage = psutil.cpu_percent()
    memory_info = psutil.virtual_memory()
    return jsonify({
        'cpu_usage': cpu_usage,
        'memory_usage': memory_info.percent,
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

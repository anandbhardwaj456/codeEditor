from flask import Flask, request, jsonify
import docker
import uuid

app = Flask(__name__)
client = docker.from_env()

@app.route("/execute", methods=["POST"])
def execute_code():
    data = request.json
    code = data.get("code", "")
    language = data.get("language", "")
    input_data = data.get("input", "")

    if not code or not language:
        return jsonify({"error": "Code and language required"}), 400

    container_name = f"code-runner-{uuid.uuid4()}"
    image = "python:3.9" if language == "python" else "node:16"

    try:
        container = client.containers.run(
            image,
            command=f"sh -c 'echo \"{code}\" > script && python3 script'",
            remove=True,
            network_disabled=True,
            mem_limit="128m",
            cpu_quota=50000,
            stderr=True,
            stdout=True
        )
        output = container.decode("utf-8")
        return jsonify({"output": output, "executionTime": "N/A"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
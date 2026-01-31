module.exports = {
    apps: [{
        name: "nexus-study-os",
        script: "npm",
        args: "start",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: "production",
            PORT: 8080,
            SERVE_STATIC: "true"
        }
    }]
}

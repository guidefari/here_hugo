---
title: "cgroups demo"
date: 2024-09-01
description: "Resource management and limits using cgroups"
tags: ["docker", "cgroups", "demo"]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=cgroups%20demo']
---

# cgroups demo

```bash
# Create a memory-limited container
sudo cgcreate -g memory:/demo
echo 100M | sudo tee /sys/fs/cgroup/memory/demo/memory.limit_in_bytes

# Run process in cgroup
sudo cgexec -g memory:demo stress --vm 1 --vm-bytes 150M
# Will be killed due to memory limit!
```

```bash
# Create a systemd service file with resource limits
cat > /etc/systemd/system/myapp.service << EOF
[Unit]
Description=My Application

[Service]
ExecStart=/usr/bin/myapp
MemoryLimit=500M
CPUQuota=50%

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start the service
systemctl daemon-reload
systemctl start myapp
```


---
title: "K8s Crash Course"
date: 2025-09-27T23:20:40+02:00
description: Scribbles from the TechWorld with Nana Crash course
tags: [k8s, containers]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=K8s+Crash+Course']
---

{{<youtube s_o8dwzRlu4>}}

# Basic components

## 1. Nodes & Pods
This is a virtual or physical machine. A pod is the smallest unit in k8s. It's an abstraction over a container. Pods are ephemeral!

Usually 1 application is installed per pod.

- master node aka control plane
  - etcd runs on the master node. in a multi-master cluster, it runs on all of them.
- worker nodes

## 2. Service
Because of the ephemeral nature of pods, **service** allows you to assign a permanet ip address to each pod. Also acts as a load balancer, routing traffic to healthy pods

## 3. Ingress
Manages external traffic routing to the internal services in the cluster 

## 4. ConfigMap
Allows you to keep configs out of the built application image. things like database connection strings, external service names etc. Makes life easier as you don't need to rebuild your entire application image just to change configs. These are plain text

## 5. Secret
Just like ConfigMap, but base64. Useful for credentials, certs, etc.
Still, not a really secure encoding, so there's tools/providers to encrypt this. 
## 6. Deployment
Blueprint for your pods. Allows you tp specify replicas, and other common configurations
## 7. StatefulSet
We can't replicate databases using a deployment, because they're stateful. This is where StatefulSets come in! These can be trickier to operate than their stateful counterparts, Deployments - that's why it's common to host DBs outside of the k8s clusters.
## 8. DaemonSet

## Virtual network
K8s provides a virtual network, and assigns each pod an IP address.

## Volumes
Kubernetes doesn't manage data persistence! Work similar to volume mounts in docker. Can be storage on a local machine, or remote.

## Control plane
The various UI's and cli's that you use to manage clusters communicate with the API server that's in the control plane.
- API server
- Scheduler
- Controller Manager

## etcd
holds the current status of any k8s component. this status information is used by the control plane to maintain the desired state of the cluster

## Helm

## namespaces
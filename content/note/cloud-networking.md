---
title: "Networking recaps for Cloud Computing"
date: 2022-03-06T13:16:53+02:00
description: I studied networking once upon a time, and I need to brush up those lessons as they're applicable to AWS Solutions Architect learnings.
tags: [cloud, networking, aws, backend, resource]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Networking%20recaps%20for%20Cloud%20Computing']
---


# Videos
{{<youtube WCCXtlvOajI>}} <br/><br/>

# OSI Model
1. Physical - 1s & 0s
2. Data Link - network protocols, error checking, frame sync. LLC & MAC
3. Network - IP, ICMP
4. Transport - TCP, UDP
5. Session - Communication channels between devices
6. Presentation - Defines how two devices should encode, encrypt, & compress data so it's received correctly on both ends.
7. Application - Used by end user software. Provides protocols like HTTP, FTP, DNS, POP

# Network Address Translation
Designed to overcome IPv4 shortages of addresses. The Router (NAT device) maintains a NAT table

- **Static NAT**: maps 1:1 -> Private IP:Public IP
- **Dynamic NAT**: many private IPs can share an equal or fewer amount of Public IP addresses
- **Port Address Translation** aka **overloading**: most common in home networks. Allows for **many Private IP addresses** to **one Public IP address**. The NAT device records source IPs & ports, and replaces those with a single public IP, and a public source port, thus the name **IP overloading**

# Subnetting
**Classes:**
- A: 0.0.0.0 - 127.255.255.255
- B: 128.0.0.0 - 191.255.255.255
- C: 192.0.0.0 - 223.255.255.255
- D: 224.0.0.0 - 239.255.255.255 - not allocated to hosts, used for multicasting
- E: 240.0.0.0 - 255.255.255.255 - not available for general use. reserved for research purposes

- [**Jack Rhysider subnet tool**](https://www.tunnelsup.com/subnet-calculator/)

## CIDR notation
- 192.168.0.15 is associated with the netmask 255.255.255.0 by using the CIDR notation of 192.168.0.15/24. This means that the first 24 bits of the IP address given are considered significant for the network routing. [src](https://www.digitalocean.com/community/tutorials/understanding-ip-addresses-subnets-and-cidr-notation-for-networking)

# Encryption
- BK has a good resource on [cryptography](https://justreflections.bhekani.com/p/simple-cryptography-for-the-rest-of-us-just-reflections-issue-25-968207).
- [Practical networking - cryptography](https://www.practicalnetworking.net/series/cryptography/cryptography)
- There's encryption at rest, and also in transit. the latter is what I'll focus on

## Symmetric
- encrypts & decrypts using the same private key. this makes sense for encryption at rest
- **key exchange problem:** one of the major drawbacks of Symmetric encryption is the Secret Key used to encrypt and decrypt must exist in two different locations. Which begs the question, how do we get the key securely from one party to the other?
- with symmetric encryption, the algorithm is publicly known. the only variable between each encrypted conversation is the Secret Key.

## Asymmetric
- uses public key & private key
- The asymmetric keys are mathematically linked. What one key encrypts, only the other can decrypt — and vice versa.
- I encrypt data with my recipient's public key, I send it across the network, receiver decrypts with their mathematically linked private key (i.e the only key that can decrypt this message). 
- **Message Signing** is another advantage asymmetric encryption brings. read [Using Asymmetric Keys](https://www.practicalnetworking.net/series/cryptography/using-asymmetric-keys/) for more insight
- Compared to symmetric encryption, asymmetric is more expensive on resources
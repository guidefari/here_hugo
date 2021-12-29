---
title: "Book Notes: Spotify Teardown"
date: 2021-12-27T12:23:42+02:00
description: "highlights, quotes, & other interesting bits from Spotify Teardown"
tags: [book, notes, platform, music, backend, product, ux, spotify, architecture, research]
---

## intro

- [MIT Press Summary](https://mitpress.mit.edu/books/spotify-teardown)
- Lovely insight into streaming culture & **platform capitalism**
- Also extensively speaks about the history of the company, including it's funding history, which I found insightful.

> Employing a unique set of methods to study a streaming giant, _Spotify Teardown_ provides an important investigation into the potential impacts of new media platforms on artists, culture, and the creative economy.
> - David TouveSenior Director, iLab, Darden School of Business, University of Virginia
> - [src](https://mitpress.mit.edu/books/spotify-teardown): content lives under the "Praise" tab

# highlights & notes
> This book subscribes to an idea of interventionism
- this is essentially *questioning the defaults*, as is being taught in the book [make time]({{<ref make-time>}})
- A good framework for this is [Harold Garfinkel's "breaching experiments"](https://wiredcosmos.com/sociology-in-action-the-breaching-experiment/)
	- [ ] search "Breaching experiments" on Youtube & you'll find lots of videos
- the idea of interventionism is a big theme throughout this book, the end of each chapter is accompanied with some sort of experiment, to put to the test, or illustrate in the real world, what was being spoken about. 
## intervention example
> “How about distributing sounds and music via Spotify in order to gain firsthand experience of its aggregators while also programming bots, or software scripts, that would listen to this music, thus short-circuiting the system?”

## interventionism expanded on
> “What if we were to complement interviews, document analysis, and overt observation of the front end of Spotify with experimental, covert access to its back end in order to compare and verify the information given and to confront interlocutors with the results?”


#### it's no coincidence that big tech companies invest in their own social research
> “One reason why some research currently seems to lack determination in confronting the critical ethical, political, and ideological issues of digital media is that research is also regularly enlisted by macroactors. It is not accidental that Facebook, Google, Microsoft, Intel, and Spotify all invest in social research. ”

- the book also illustrates how doing research around these companies is a *red tape affair*. the pushback you'll face ranges from *minor inconvenience* all the way up to litigation against your efforts.

#### Ownership does not equal control
- Some quotes related to **platform**, & the challenges caused by the fact that spotify distributes copyrighted material.

> “Spotify’s very existence remains dependent on the willingness of the so-called Big Three—the global record companies Universal, Sony, and Warner—to renew music licensing deals... these must not demand more royalties than Spotify is able to pay” 

> “Spotify has closed numerous deals with data center operators, hardware manufacturers, and telecom carriers”

> “The dependence on venture capital and infrastructure operators is a characteristic feature of most technology startups that intend to become platforms.”

> “Spotify’s current dominance in music streaming does not simply mirror the market dominance enjoyed by other platforms, such as Facebook. The latter is designed to facilitate forms of exchange between users, not to distribute copyrighted works. The opposite goes for Spotify, which makes its survival more dependent on licenses”

> “Spotify, in other words, relies not only on investors, rights holders, and network operators but also on policymakers. Music piracy must not be too rampant, collecting societies too powerful, or privacy protections too strict if Spotify is to succeed in a country.”

## History
> “In retrospect, Spotify’s early Swedish history appears in perfect sync with the legal proceedings against The Pirate Bay, which began with a police raid in May 2006—just weeks after Spotify was founded.”

> “This is how Lorentzon and Ek met: two Swedish multimillionaires—thirty-seven and twenty-three years old, respectively—both experiencing the boredom that may come with financial independence, as they would later explain.”

> “Spotify opened its first office at Riddargatan 20 in central Stockholm, where software development begun in August 2006. The software was initially for distributing data over the internet from a central server to a large number of recipients using a peer-to-peer (P2P) network”

### Financing
> “The first financing round (Series A) of about $20 million coincided with Spotify’s public launch in 2008. Subsequently, larger amounts of capital have been injected, typically at an interval of twelve to eighteen months.”

### Product: Early spotify
- Spotify's early architecture distributed music using **`P2P`** until spring 2014.
  - another common [**P2P**](https://networkencyclopedia.com/peer-to-peer-network-p2p/) use-case is to download torrent files
- The initial strategy was to distribute free music, supported by ads
	- This proved to be very tricky when it came to launching the service in the US. royalties chats
	- Daniel Ek seemed almost 'anti-subscription', & essentially got strong-armed into it
> “The user was effectively conceived of as a sovereign individual, who already knew exactly what he or she wanted to listen to and did not need help with music recommendations. ”

#### Period B (late 2009)
> “Meanwhile, a new consensus regarding the advantages of subscription was forming within the media industries. In the United States, subscription-based television services, for example, fared remarkably well through the recession.”

> “The idea of selling subscriptions was rather forced upon Spotify by the holders of music licenses, and the economic crisis exerted an even stronger pressure in that direction.”

> “A clever way to introduce a new subscription business is to bundle the monthly bill together with another one that the customer is already paying. This was the reasoning behind Spotify’s strategy of seeking deals with telecom operators. The aim was to package the music service together with mobile services. The consumer would not really notice the payment, and the service would hence “feel like free.” ”
	
	- this was done in Sweden & the UK

#### Period C (2010 - 2011)

- 16 mil invested by Sean Parker, cofounder of Napster, founding president of Facebook, who still played an "informal but important role in its (Facebook) leadership" at the time of investing.
> “By early 2010, just after Parker joined, it was already possible to observe a Facebookian influence on Spotify’s strategies, well documented in patents registered by Facebook engineers at that time.70”

#### Period D (2011 - 2012)
- July 4 2011: US launch
- No big advertisement, mainly relied on word of mouth, which was a strategy that played 2 roles, protect network capacity, & feed into the hype culture.

> “The limitation on invites not only ensured that network capacity would not be overloaded but also contributed to hype that associated Spotify with the lifestyle of those circles that were first to receive invites—primarily young, hip New Yorkers.”

#### Period E (2013)
- Now they're starting to pay attention to recommending personalised music
	- Songza had already been doing this

> “Toward the end of the year, Ek shifted tactics and recognized the need for authority: “Here’s what our users are telling us: Spotify is great when you know what music you want to listen to, but not so great when you don’t.…”

> “Curating millions of songs was a task too large to be left to users.”

> “This meant that Spotify began to transform itself from being a simple distributor of music to the producer of a unique service.”

> “Now the selling point was to provide not more music but better music.”

> “This polarity was transcended by the idea that musical quality is dependent on context. This is a utilitarian approach in which music is understood as functional for certain activities”

#### Period F (2013 - 2015)
> “A truly significant change, enacted in Spring 2014, was Spotify’s dismantling of its P2P network, which until then had guaranteed its supply of bandwidth.”

> “The shutdown of one of the internet’s largest P2P networks, which was then replaced by central servers, must be considered a major infrastructural event.”

> “Between October 2008 and June 2015, the company raised $1.6 billion in seven rounds of investment from twenty-six investors, including Coca-Cola, Goldman Sachs, and Palo Alto–based Technology Crossover Ventures. ”

#### Toward an IPO
- Dependence on:
	-  venture capital
	- rights holders

> “Rather than being an autonomous innovator with a divine power to shape the future of music, we have shown how Spotify has often been rather late to follow trends set by others.”

> “Several times, the service has proudly introduced new features, only to dismantle them shortly thereafter. The core business model has also changed several times: first it was not specifically about music, then it was about free and ad-supported music, and then the free service was reconceived as a way to market the subscription service.”


## intervention: record label setup
- Heinz Duthel: 
> “is most likely a software agent designed to mass produce literature—albeit a bot writer with a particular taste for classical historical figures, foreign politics, and new age spirituality”

> “Recorded music simply needs metadata and paratextual materials, or else it is extremely difficult to find or sell. Within the ecosystem of music streaming, aggregators perform the crucial role of prompting and collecting such music metadata, thus making music and artists “algorithm ready.”


# When do files become music
> “Approximately 20 percent of Spotify’s catalog has not been listened to by anyone even once.”

> “As illustrated by the 2015 addition of television content, Spotify now operates increasingly like a conventional American media company while retaining the benefits of financial and regulatory loopholes granted to European tech firms.”


# intervention: how we tracked streams
> “First, data is not technically transported—as in being moved from one location to the next—when information is streamed. Instead, data is copied and multiplied. Thus, the question of how streamed files “move” is not only a matter of tracing changed data locations but an issue of tracking how data proliferates”

> “Packet sniffers thus challenge the idea that computers are under our control and only act at our request; they reveal the hidden—and sprawling—transmissions that occur within internet networks.”

> “Since 2015, however, the company has increasingly shipped its data through Google Cloud Platform, which involves using not only Google’s global cloud/storage data centers but also other Google services, such as virtual machines and database management systems.”

> “In addition, Spotify is hooked up to at least five internet exchange points (IXPs)”

> “Even if Spotify appeared to be running smoothly, hundreds of minor malfunctions were taking place in its ”

> “For instance, during the premium session, the Spotify client made 213 attempts to establish contact with an IP address located in San Francisco, without any success.”

> “The point is that network protocol analysis tools enable considerations of how “technology cannot exist without failure.”

### Network Actors
- detected using Wireshark
|Entity|Type|
| --- | ---|
| AOL Transit Data Network | Tier-1 Backbone Network| 
| Level 3/Rubicon | Tier-1 Backbone Network| 
| Akamai | CDN | 
| Amazon CloudFront | CDN |
| Appnexus | Programmatic advertising |
| AudienceScience | Programmatic advertising | 
| MediaMath | Programmatic advertising | 
| Turn | Programmatic advertising | 
| Fastly | Cloud Platform |
| Google | Cloud Platform | 
| Spotify | Datacenter | 

> “By using TrIPE and Ogg Vorbis, Spotify gains access to encryption and compression technologies without having to pay costly proprietary fees to build its software on top of them.”

> “The Spotify client, for example, has benefitted significantly from the labor put into more than three hundred different open-source projects.31”

> “When looking at the codecs and software on which the service runs, it becomes obvious that Spotify is neither self-built nor self-maintained and instead relies on a vast network of actors for its service to function—another indication that the notion of an enclosed platform is inapt.”

> “In fact, Akamai has been singled out as providing a private network infrastructure that serves to enhance the unequal distribution of global network connectivity. Because of their practice of selling high-quality internet access to selected customers, CDNs are also known for sidestepping net neutrality orders and regulations, thus counteracting the basic and open end-to-end principles of the internet.”

> “our experiment exemplifies how a task as mundane as listening to music on Spotify may trigger complex entanglements with internet infrastructures that are tightly linked to controversial debates around digital policy making, network neutrality and the freedom of the web.”

> “digital music commodity,” arguing that once digitized, music always remains the same type of commodity.”

# Authors
- [Jonathan Sterne](https://sterneworks.org/about/)
- [Jeremy Wade Morris](http://jeremywademorris.com/?page_id=6)
- [Patrick Vonderau](https://patrickvonderau.com/)
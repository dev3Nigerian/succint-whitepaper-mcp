import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Define whitepaper content structure
export const WhitepaperContent = {
  title: "Succinct Network: Prove the World's Software",
  authors: ["Uma Roy", "John Guibas", "Kshitij Kulkarni", "Mallesh Pai", "Dan Robinson"],
  sections: [
    {
      heading: "Abstract",
      content: "The Succinct Network is a decentralized protocol that proves the world's software. It coordinates a distributed set of provers who generate zero-knowledge proofs through a novel incentive mechanism called proof contests to create the world's most efficient, robust proving cluster. Users submit requests in the form of RISC-V programs with inputs and fees that determine proving priority. Provers engage in proof contests, which are all-pay auctions for the right to generate proofs with minimal latency and cost, in order to earn fees. The auctions settle on an application-specific blockchain. Both proof contests and the blockchain are codesigned with SP1, a zkVM that proves the execution of RISC-V bytecode."
    },
    {
      heading: "Introduction",
      content: "Decentralized systems such as blockchains operate based on distributed consensus: multiple parties reexecute computation and agree on the result. In exchange, blockchains allow for trustless applications that do not have a centralized mediator. This idea was first applied to decentralized money with Bitcoin and then to arbitrary trustless computation with Ethereum. Redundant computation, however, is costly and imposes overhead on blockchains relative to their centralized counterparts. Due to this reason, blockchains remain bottlenecked. Succinct zero-knowledge (ZK) proofs promise a path forward. They enable a prover to convince a verifier of the knowledge of a claim (such as the execution of a program with optionally private inputs) with a proof that is much shorter than the claim itself."
    },
    {
      heading: "Succinct Network",
      content: "The Succinct Network introduces the idea of a global, distributed proving cluster codesigned with SP1 and powered by a competitive auction mechanism called proof contests to dramatically expand the proving capacity of the world. It provides a unified platform for users to submit proof requests and for anyone in the world to provide proving capacity. Provers can join the network permissionlessly and participate by running node software and users can get high-reliability guarantees for their requests.",
      subsections: [
        {
          heading: "Market Structure",
          content: "There are two primary participants in the network: applications who demand ZK proving and provers who provide proving capacity and infrastructure. The cluster and proof contest mechanism jointly induce a market structure with a virtuous flywheel by aggregating supply and demand. This incentivizes global scale competition for developing increasingly efficient proving infrastructure."
        }
      ]
    },
    {
      heading: "Proof Contests",
      content: "Proof contests are the core mechanism of the Succinct Network. They're an auction that allocates requests to provers in the network and allows them to earn fees by balancing the dual forces of cost effectiveness and decentralization. At any time, users have sent a set of outstanding proof requests and a set of provers are available to prove them. Each request comes attached with a fee, which is the amount the user pays for the proof request, a cycle count, which is a measure of the amount of work required to generate a proof of the request, and a deadline.",
      subsections: [
        {
          heading: "Mechanism Description",
          content: "In our design, provers deposit collateral to be able to participate in an all-pay auction or Tullock contest to be assigned the right to generate proofs for requests. Participation in the contest allows provers to compete for proof generation. The provers' bids in the auction are interpreted as the amount they will pay to receive the right to generate proofs. All provers pay their bids, and the winning prover is selected randomly among the provers with probability that is some function of their bid."
        },
        {
          heading: "Analysis and Incentives",
          content: "The proof contest mechanism induces competition on proving by asking provers to bid for the right to fulfill requests. By asking provers to bid for requests, the mechanism aligns the provers' incentives with a key requirement of the user: finding provers that can competitively generate proofs."
        },
        {
          heading: "Proving Pools",
          content: "Individual provers who may not have sufficient sophistication or collateral to participate in the auction outright can form proving pools in which they can collectively bid for request slots, akin to mining pools in Bitcoin. We introduce the notion of proving pools, which are composed of many provers who jointly pool their capacity to bid in the proof contest mechanism."
        }
      ]
    },
    {
      heading: "Network Architecture",
      content: "The Succinct Network is implemented as an application-specific blockchain that coordinates users and provers. The blockchain serves to provide censorship resistance and decentralization required for downstream applications. Users submit requests to and provers bid and fulfill proofs on the blockchain. The blockchain is codesigned with SP1 to make fulfilling and verifying proofs seamless and to prevent spamming and other griefing vectors.",
      subsections: [
        {
          heading: "Implementation Requirements",
          content: "Any implementation of the proof contest mechanism for a network that assigns proof requests to provers should satisfy the following: low latency, censorship resistance, and liveness."
        },
        {
          heading: "Participation",
          content: "There are two main parties in the network: users, who submit proof requests, and provers, who fulfill proofs. There are third parties called relayers who provide services that enhance the user experience, such as simulating program execution."
        }
      ]
    },
    {
      heading: "Proving the World's Software",
      content: "The network has significant implications for accelerating verifiability on the Internet. Verifiability means that applications can outsource expensive computation and business logic without relying on trusted intermediaries, and users can receive guarantees that sensitive information will remain private and that the execution of the computation is correct. The aggregation of proving capacity under one permissionless, global network means that decentralized systems can face shared standards and scale with minimal overhead.",
      subsections: [
        {
          heading: "Applications",
          content: "Several applications can be built using or enhanced by the network: Rollups, Oracles and bridges, Identity and authentication, Credit scoring and auditing, Verifiable inference, Coprocessors, and Outsourced cloud computing."
        }
      ]
    },
    {
      heading: "Conclusion",
      content: "The Succinct Network is a protocol for coordinating a decentralized set of provers to satisfy user requests for ZK proof generation via a competitive auction called proof contests to create a global-scale distributed proving cluster. The network is codesigned and integrated with SP1, a zkVM that allows for the proving of arbitrary deterministic Rust programs. It enables a broad infrastructure buildout for proof generation akin to other cryptoeconomic systems, and ensures that applications from blockchain scaling to privacy have access to robust, competitive proving."
    }
  ]
};
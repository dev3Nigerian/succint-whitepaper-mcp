// This file contains explanations of key concepts from the Succinct Network

export const KeyConcepts = {
  "proof contests": "Proof contests are all-pay auctions where provers compete to receive fees provided by proof requests. Provers bid for the right to generate proofs, and the winner is selected with probability proportional to their bid. This mechanism balances cost competition with prover decentralization.",
  "sp1": "SP1 is a zkVM (zero-knowledge Virtual Machine) that proves the execution of RISC-V bytecode. The Succinct Network is codesigned with SP1 to prevent proof copying and reused work.",
  "zkvm": "A Zero-Knowledge Virtual Machine (zkVM) allows for the proving of arbitrary deterministic programs. Unlike application-specific circuit design, zkVMs enable the use of normal code and existing software.",
  "zero-knowledge proofs": "Zero-knowledge proofs enable a prover to convince a verifier of the knowledge of a claim (such as the execution of a program) with a proof that is much shorter than the claim itself, while optionally keeping inputs private.",
  "proving pools": "Proving pools allow individual provers with home setups to collectively pool their capacity to bid in proof contests, similar to mining pools in Bitcoin. This enables permissionless participation without needing sophisticated bidding strategies.",
  "prover decentralization": "The Succinct Network is designed to incentivize a decentralized set of provers, ensuring high reliability and liveness for applications. This is achieved through the all-pay feature of proof contests, which prevents a single prover from dominating the network.",
  "risc-v": "RISC-V is an open-source instruction set architecture. In the Succinct Network, users submit proof requests in the form of RISC-V programs with inputs.",
  "application-specific blockchain": "The Succinct Network uses an application-specific blockchain to coordinate users and provers, providing censorship resistance and decentralization for downstream applications."
};
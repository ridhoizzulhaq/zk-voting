import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const contractAddress = '0xcc50a7828d58CAF32BC3cC02cE601ced2D600464';
const abi = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_candidateNames",
        "type": "string[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
    "signature": "0x3477ee2e"
  },
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
    "signature": "0x2d35a8a2"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
    "signature": "0xff981099"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x0121b93f"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
    "signature": "0xa3ec138d"
  }
];
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, contractAddress);

function App() {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const numCandidates = await contract.methods.candidatesCount().call();
      const candidates = [];
      const votes = [];
      for (let i = 1; i <= numCandidates; i++) {
        const candidate = await contract.methods.candidates(i).call();
        const vote = await contract.methods.getVotes(i).call();
        candidates.push(candidate.name);
        votes.push(vote);
      }
      setCandidates(candidates);
      setVotes(votes);
    }
    fetchData();
  }, []);

  async function vote(candidateIndex) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.vote(candidateIndex).send({ from: accounts[0] });
    // Refresh data after voting
    const votes = [];
    for (let i = 1; i <= candidates.length; i++) {
      const vote = await contract.methods.getVotes(i).call();
      votes.push(vote);
    }
    setVotes(votes);
  }

  return (
    <div className="App">
      <h1>List of Candidates</h1>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            {candidate} - Votes: {votes[index]}
            <button onClick={() => vote(index + 1)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

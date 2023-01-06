import type { NextApiRequest, NextApiResponse } from 'next'
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'
import { ethers } from 'ethers'

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  switch (method) {
    case 'GET': {
      // Make markletree
      const leafNodes = addresses.map((x) => {
        return keccak256(
          ethers.utils.solidityPack(
            ['address', 'uint8'],
            [x.split(',')[0].toLowerCase(), Number(x.split(',')[1])]
          )
        )
      })
      const merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      })
      const rootHash = merkleTree.getRoot()
      return res.status(200).json({ merkleRoot: rootHash })
    }
    case 'POST': {
      const address = req.body.address as string
      if (!address) {
        return res.status(400).end('Not specify wallet address')
      }
      // Make markletree
      const leafNodes = addresses.map((x) =>
        keccak256(
          ethers.utils.solidityPack(
            ['address', 'uint8'],
            [x.split(',')[0].toLowerCase(), Number(x.split(',')[1])]
          )
        )
      )
      const merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      })
      const rootHash = merkleTree.getRoot()

      const wlAddress = addresses.filter(
        (x) => address == x.split(',')[0].toLowerCase()
      )

      // Validate
      if (wlAddress.length > 0) {
        const hashedAddress = keccak256(
          ethers.utils.solidityPack(
            ['address', 'uint8'],
            [
              wlAddress[0].split(',')[0].toLowerCase(),
              wlAddress[0].split(',')[1],
            ]
          )
        )
        const hexProof = merkleTree.getHexProof(hashedAddress)
        const verify = merkleTree.verify(hexProof, hashedAddress, rootHash)

        if (!verify) {
          return res.status(404).end('your address not whitelisted')
        }
        return res.status(200).json({ hexProof: hexProof })
      } else {
        return res.status(404).end('your address not whitelisted')
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}

export const addresses = ['xxxx,1']

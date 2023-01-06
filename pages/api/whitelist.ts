import type { NextApiRequest, NextApiResponse } from 'next'
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'
import { ethers } from 'ethers'
import { addresses } from './merkletree'

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  const address = req.query.address as string
  switch (method) {
    case 'GET': {
      const wlCount = addresses.filter(
        (x) => address.toLowerCase() == x.split(',')[0].toLowerCase()
      )
      if (wlCount.length > 0) {
        return res.status(200).json({ wlCount: wlCount[0].split(',')[1] })
      }
      return res.status(200).json({ wlCount: 0 })
    }
    default: {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}

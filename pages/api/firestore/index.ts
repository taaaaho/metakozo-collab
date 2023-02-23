import type { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin, { Config } from '@/utils/firestore'

const firestore = firebaseAdmin.firestore()
const configRef = firestore.collection('collabo-config').doc('metakozo')

interface Request extends NextApiRequest {
  body: Config
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: Request, res: NextApiResponse) => {
  const { method } = req
  if (
    req.headers.referer !== 'http://localhost:3000/admin' &&
    req.headers.referer !== 'https://collaboration.metakozo-dao.xyz/admin'
  ) {
    return res.status(400).json('No')
  }
  switch (method) {
    case 'GET': {
      const snapshot = await configRef.get()
      const config = snapshot.data()
      return res.status(200).json(config)
    }

    case 'POST': {
      const {
        chainId,
        contractAddress,
        backgroundImagePC,
        backgroundImageSP,
        centerImage,
      } = req.body
      await configRef.set(
        {
          chainId,
          contractAddress,
          backgroundImagePC,
          backgroundImageSP,

          centerImage,
        },
        { merge: true }
      )

      return res.status(200).json('ok')
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, lastname, phone, email, amount } = req.body;

  console.log('Form data received:', {
    name,
    lastname,
    phone,
    email,
    amount
  });

  return res.status(200).json({ message: 'Form data received successfully' });
}

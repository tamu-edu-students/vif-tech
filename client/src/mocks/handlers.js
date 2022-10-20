import { rest } from "msw";

const handlers = [
  rest.get(process.env.REACT_APP_BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
          users: [
            {
              username: "abcd",
              email: "abcd@gmail.com"
            },
            {
              username: "eeeee",
              email: "eeeee@gmail.com"
            },
          ]
      })
    );
  }),
  
  rest.get('*', (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: 'Please add request handler' })
    );
  })
];

export default handlers;

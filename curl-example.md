# Example curl command to call the OpenAI endpoint

```sh
curl -X POST http://localhost:3000/api/v1/openai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 3e034a37-abe3-4820-ad35-3cdeb6cbf1e8" \
  -d '{
    "message": "Hello, how are you?"
  }'
```

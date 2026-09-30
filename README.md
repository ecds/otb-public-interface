# OTB Public Interface

React Router v8 / Express frontend for OpenTourBuilder. Multi-tenant: the subdomain determines which tour set is loaded.

## Domain structure

| Environment | Root URL | Tenant URL |
|---|---|---|
| Production | `opentour.site` | `<tenant>.opentour.site` |
| Staging | `dev.opentour.site` | `<tenant>.dev.opentour.site` |
| Local | `lvh.me:4200` | `<tenant>.lvh.me:4200` |

The server resolves the tenant by finding the leftmost subdomain that is not a known environment label (`dev`, `staging`, `www`). Requests with no tenant (e.g. the root domain) are served the tour set index.

## Development

Start the dev server:

```sh
npm run dev
```

To test location services (requires HTTPS):

```sh
PROTOCOL=https npm run dev
```

See [this article](https://medium.com/@hjblokland/how-to-create-self-signed-wildcard-ssl-certificates-with-mkcert-on-macos-a6a3663aa157) for generating local wildcard certs.

## Tests

```sh
npm test
```

## Deployment

Deployments are automated via GitHub Actions on push to `develop` or `main`.

| Branch | Image tag | `NODE_ENV` | ECS target |
|---|---|---|---|
| `develop` | `latest` | `staging` | `otb-pub-dev` |
| `main` | `stable` | `production` | `otb-pub-prod` |

The workflow builds a Docker image, pushes it to ECR, and force-restarts the ECS service. The registry URI is stored in the `ECR_REGISTRY` GitHub secret.

To deploy manually:

```sh
npm run build
npm start
```

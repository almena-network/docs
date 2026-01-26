import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

export default function NotFound(): ReactNode {
  return (
    <Layout title="Page Not Found">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <Heading as="h1" className="hero__title">
              404 - Page Not Found
            </Heading>
            <p>We could not find what you were looking for.</p>
            <p>
              <Link to="/">
                Return to Getting Started
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

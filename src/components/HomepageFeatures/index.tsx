import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: "homepage.features.autonomy.title",
      message: "Autonomy and Total Control (User Sovereignty)",
    }),
    Svg: require("@site/static/img/undraw_authentication_1evl.svg").default,
    description: (
      <Translate id="homepage.features.autonomy.description">
        In the traditional model, if a social network decides to close your
        account, you lose your identity within that ecosystem. On a
        decentralized platform, your identity exists independently of any
        service.
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.credentials.title",
      message: "Verifiable Credentials and DIDs",
    }),
    Svg: require("@site/static/img/undraw_connected-world_anke.svg").default,
    description: (
      <Translate id="homepage.features.credentials.description">
        This is the technical engine that builds trust without the need for
        central databases. It is based on two key components: DIDs
        (Decentralized Identifiers) and Verifiable Credentials (VCs)
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.interoperability.title",
      message: "Interoperability Based on Open Standards",
    }),
    Svg: require("@site/static/img/undraw_document-ready_o5d5.svg").default,
    description: (
      <Translate id="homepage.features.interoperability.description">
        For decentralized systems to be useful, they cannot depend on a single
        company or proprietary technology.
      </Translate>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

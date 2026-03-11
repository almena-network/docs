import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Autonomía y Control Total (Soberanía del Usuario)",
    Svg: require("@site/static/img/undraw_authentication_1evl.svg").default,
    description: (
      <>
        En el modelo tradicional, si una red social decide cerrar tu cuenta,
        pierdes tu identidad dentro de ese ecosistema. En una plataforma
        descentralizada, tu identidad existe independientemente de cualquier
        servicio.
      </>
    ),
  },
  {
    title: "Credenciales Verificables y DIDs",
    Svg: require("@site/static/img/undraw_connected-world_anke.svg").default,
    description: (
      <>
        Este es el motor técnico que construye confianza sin necesidad de
        bases de datos centrales. Se basa en dos componentes clave: DIDs
        (Identificadores Descentralizados) y Credenciales Verificables (VCs)
      </>
    ),
  },
  {
    title: "Interoperabilidad Basada en Estándares Abiertos",
    Svg: require("@site/static/img/undraw_document-ready_o5d5.svg").default,
    description: (
      <>
        Para que los sistemas descentralizados sean útiles, no pueden depender
        de una sola empresa o tecnología propietaria.
      </>
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

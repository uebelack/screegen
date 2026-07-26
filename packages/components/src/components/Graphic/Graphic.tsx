import { ProjectConfig, GRAPHIC_WIDTH, GRAPHIC_HEIGHT } from "../../types";
import styles from "./Graphic.module.scss";

export interface GraphicProps {
  config: ProjectConfig;
  index: number;
  language: string;
  className?: string;
}

/**
 * Renders a single graphic (from `config.graphics[index]`) at its
 * configured size. Used both by the preview route and by the CLI when capturing
 * the image.
 */
export function Graphic({ config, index, language, className }: GraphicProps) {
  const graphic = config.graphics?.[index];

  if (!graphic) {
    return null;
  }

  const width = graphic.width ?? GRAPHIC_WIDTH;
  const height = graphic.height ?? GRAPHIC_HEIGHT;
  const key = graphic.key ?? String(index);
  const Component = graphic.component;

  return (
    <div
      className={`${styles.graphic} ${className || ""}`}
      data-graphic={key}
      style={{ width, height }}
    >
      {Component ? (
        <Component language={language} deviceKey={key} width={width} height={height} />
      ) : (
        key
      )}
    </div>
  );
}

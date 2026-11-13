import { useParams } from "react-router-dom";
import { ProjectConfig } from "../../types/index.js";
import { Graphic } from "../Graphic/index.js";

export interface GraphicPageProps {
  config: ProjectConfig;
}

export function GraphicPage({ config }: GraphicPageProps) {
  const { index, language } = useParams<{
    index: string;
    language: string;
  }>();

  if (index === undefined || !language) {
    return <div>Invalid graphic parameters</div>;
  }

  return <Graphic config={config} index={Number(index)} language={language} />;
}

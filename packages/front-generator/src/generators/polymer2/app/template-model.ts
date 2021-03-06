import {ProjectInfo} from "../../../common/model/cuba-model";

export interface Polymer2AppTemplateModel {
  generatorPackageVersion: string;
  title: string;
  baseColor: string;
  basePath: string;
  project: ProjectInfo;
  genClassName: (suffix: string) => string;
}
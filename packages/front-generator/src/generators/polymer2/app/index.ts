import * as Base from "yeoman-generator";
import {Questions} from "yeoman-generator";
import * as path from "path";
import {ProjectInfo} from "../../../common/model";
import {QuestionType} from "../../../common/inquirer";
import {Polymer2AppTemplateModel} from "./template-model";


export = class Polymer2AppGenerator extends Base {

  private props?: {project:ProjectInfo};

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
    this.destinationRoot(path.join(this.destinationRoot(), '.tmp'));
  }

  async prompting() {
    const questions: Questions = [{
      name: 'modulePrefix',
      message: 'Module Prefix',
      type: QuestionType.input,
      'default': 'app'
    }, {
      name: 'namespace',
      message: 'Project Namespace',
      type: QuestionType.input
    }, {
      name: 'locales',
      message: 'Locales',
      type: QuestionType.checkbox,
      choices: [{
        name: 'English',
        value: 'en',
        checked: true
      }, {
        name: 'Russian',
        value: 'ru'
      }]
    }];

    this.props = {project: await this.prompt(questions) as ProjectInfo};
  }

  writing() {
    console.log(this.sourceRoot());
    console.log(this.destinationPath());

    if (!this.props) {
      return;
    }

    const templateModel: Polymer2AppTemplateModel = answersToModel(this.props.project);

    this.fs.copy(this.templatePath() + '/images/**', this.destinationPath('images'));
    this.fs.copyTpl(this.templatePath() + '/src/**', this.destinationPath('src'), templateModel);
    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), templateModel);
  }

  end() {
    this.log('CUBA Polymer client has been successfully generated');
  }
}


function answersToModel(project: ProjectInfo): Polymer2AppTemplateModel {
  return {
    title: project.name,
    baseColor: '#2196F3',
    project: project
  };
}

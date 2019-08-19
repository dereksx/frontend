import {Entity, ProjectModel, View} from "./cuba-model";
import * as ts from "typescript";

const VIEW_NAME_TYPE_SUFFIX = 'ViewName';
const VIEW_NAME_TYPE_PARAMETER = 'V';
const excludes = ['SearchFolder', 'AppFolder']; // todo fix model export

export function createEntityViewTypes(entity: Entity, projectModel: ProjectModel): ts.Node[] {
  const {name: entityName, className} = entity;
  if (!entityName || excludes.indexOf(className) > -1) {
    return [];
  }
  const views = findViews(entityName, projectModel);
  return [
    createViewNamesType(className, views),
    createEntityViewType(className, views)
  ];
}

function createViewNamesType(className: string, views: View[]): ts.TypeAliasDeclaration {
  return ts.createTypeAliasDeclaration(
    undefined,
    [
      ts.createToken(ts.SyntaxKind.ExportKeyword)
    ],
    className + VIEW_NAME_TYPE_SUFFIX,
    undefined,
    ts.createUnionTypeNode(views.map(view =>
      ts.createLiteralTypeNode(
        ts.createLiteral(view.name)
      )
    ))
  )
}


/**
 * e.g.
 *
 * export type EntityView<V extends EntityViewName> = V extends '_minimal' ? Pick<Entity, 'id', 'name'> : never
 *
 * @param className
 * @param views
 */
function createEntityViewType(className: string, views: View[]): ts.TypeAliasDeclaration {
  const typeNode: ts.TypeNode = views
    .filter(view => view.allProperties.length > 0)
    .reduceRight(
      (typeExpr: ts.TypeNode, view): ts.TypeNode => {
        return ts.createConditionalTypeNode(
          ts.createTypeReferenceNode(VIEW_NAME_TYPE_PARAMETER, undefined),
          ts.createLiteralTypeNode(
            ts.createLiteral(view.name)
          ),
          createPickPropertiesType(className, view),
          typeExpr
        )
      },
      ts.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
    );


  return ts.createTypeAliasDeclaration(
    undefined,
    [
      ts.createToken(ts.SyntaxKind.ExportKeyword)
    ],
    className + 'View',
    [ts.createTypeParameterDeclaration(
      ts.createIdentifier(VIEW_NAME_TYPE_PARAMETER),
      ts.createTypeReferenceNode(className + VIEW_NAME_TYPE_SUFFIX, undefined)
    )],
    typeNode
  )

}


/**
 * e.g.
 *
 * Pick<Entity, 'id', 'name'>
 *
 * @param className
 * @param view
 */
function createPickPropertiesType(className: string, view: View): ts.TypeReferenceNode {
  return ts.createTypeReferenceNode(
    'Pick',
    [
      ts.createTypeReferenceNode(className, undefined),
      ts.createUnionTypeNode(view.allProperties.map(property =>
        ts.createLiteralTypeNode(
          ts.createLiteral(property.name)
        )
      ))
    ]
  );
}

function findViews(name: string, projectModel: ProjectModel): View[] {
  if (!projectModel.views) {
    return []
  }
  return projectModel.views.filter((view) => view.entity === name);
}
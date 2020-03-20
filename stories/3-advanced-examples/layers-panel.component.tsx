import * as React from "react";
import classnames from "classnames";
import arrayMove from "array-move";

import {
  DragEndMeta,
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  Item,
  List,
  PlaceholderRendererInjectedProps,
  StackedGroupRendererInjectedProps,
  StackedGroupRendererMeta,
} from "../../src";

import styles from "./layers-panel.css";

type Layer = { id: string; name: string; children?: Layer["id"][] };

const rootLayerId = "root";
const initialLayerEntitiesMap = new Map<Layer["id"], Layer>([
  [
    rootLayerId,
    {
      id: rootLayerId,
      name: "",
      children: [
        "14a005b8-76a2-4e59-abd6-7612793ee04e",
        "08a9ae06-ed6b-4f3e-ae51-a9d4d563dead",
        "47ddb750-c6af-4587-8333-d4749ddeb23f",
        "860c0911-e23f-40c1-8612-bca306337c15",
        "266797ee-bb96-46a4-9c53-d64c2e8ca4b4",
        "e51d66cd-0ef3-44a1-9393-9fd3f238ebee",
      ],
    },
  ],
  [
    "14a005b8-76a2-4e59-abd6-7612793ee04e",
    { id: "14a005b8-76a2-4e59-abd6-7612793ee04e", name: "Layer 0", children: undefined },
  ],
  [
    "08a9ae06-ed6b-4f3e-ae51-a9d4d563dead",
    { id: "08a9ae06-ed6b-4f3e-ae51-a9d4d563dead", name: "Layer 1", children: undefined },
  ],
  [
    "47ddb750-c6af-4587-8333-d4749ddeb23f",
    {
      id: "47ddb750-c6af-4587-8333-d4749ddeb23f",
      name: "Group 0",
      children: [
        "506830c9-3460-404d-a608-5470f3ad5c2b",
        "a82ddb48-8bf5-469a-b84e-320ded851dee",
        "92474c86-df50-458e-893e-4932cb6a7f4c",
      ],
    },
  ],
  [
    "506830c9-3460-404d-a608-5470f3ad5c2b",
    { id: "506830c9-3460-404d-a608-5470f3ad5c2b", name: "Grouped Layer 0", children: undefined },
  ],
  [
    "a82ddb48-8bf5-469a-b84e-320ded851dee",
    { id: "a82ddb48-8bf5-469a-b84e-320ded851dee", name: "Grouped Layer 1", children: undefined },
  ],
  [
    "92474c86-df50-458e-893e-4932cb6a7f4c",
    { id: "92474c86-df50-458e-893e-4932cb6a7f4c", name: "Grouped Layer 2", children: undefined },
  ],
  [
    "860c0911-e23f-40c1-8612-bca306337c15",
    { id: "860c0911-e23f-40c1-8612-bca306337c15", name: "Layer 2", children: undefined },
  ],
  [
    "266797ee-bb96-46a4-9c53-d64c2e8ca4b4",
    { id: "266797ee-bb96-46a4-9c53-d64c2e8ca4b4", name: "Layer 3", children: undefined },
  ],
  ["e51d66cd-0ef3-44a1-9393-9fd3f238ebee", { id: "e51d66cd-0ef3-44a1-9393-9fd3f238ebee", name: "Group 1", children: [] }],
]);

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={styles.dropLine} style={injectedProps.style} />
);

export const LayersPanelComponent = () => {
  const [layerEntitiesMapState, setLayerEntitiesMapState] = React.useState(initialLayerEntitiesMap);

  const itemElements = React.useMemo(() => {
    const topLevelLayers = layerEntitiesMapState
      .get(rootLayerId)!
      .children!.map((layerId) => layerEntitiesMapState.get(layerId)!);
    const createItemElement = (layer: Layer, index: number, nestLevel = 0) => {
      const style: React.CSSProperties = { "--nest-level": nestLevel } as any;
      if (layer.children != undefined) {
        const childLayers = layer.children.map((layerId) => layerEntitiesMapState.get(layerId)!);
        const childLayerElements = childLayers.map((layer, index) => createItemElement(layer, index, nestLevel + 1));
        const isEmpty = childLayerElements.length === 0;
        const iconClassName = classnames(
          "fa",
          { "fa-caret-down": !isEmpty, "fa-caret-right ": isEmpty },
          styles.icon,
          styles.arrow,
        );

        return (
          <Item key={layer.id} identifier={layer.id} index={index} isGroup>
            <div className={classnames(styles.item, styles.group)} style={style}>
              <div className={iconClassName} />
              <div className={classnames("fa", "fa-folder", styles.icon, styles.folder)} />
              {layer.name}
            </div>

            <div style={style}>{childLayerElements}</div>
          </Item>
        );
      }

      return (
        <Item key={layer.id} identifier={layer.id} index={index}>
          <div className={styles.item} style={style}>
            <div className={styles.contents}>
              <div className={styles.preview} />
              {layer.name}
            </div>
          </div>
        </Item>
      );
    };

    return topLevelLayers.map((layer, index) => createItemElement(layer, index));
  }, [layerEntitiesMapState]);
  const renderGhostElement = React.useCallback(
    ({ identifier, isGroup }: GhostRendererMeta<Layer["id"]>) => {
      const layer = layerEntitiesMapState.get(identifier);
      if (layer == undefined) return;

      if (isGroup) {
        return (
          <div className={classnames(styles.item, styles.group, styles.ghost)}>
            <div className={classnames("fa", "fa-folder", styles.icon, styles.folder)} />
            {layer.name}
          </div>
        );
      }

      return (
        <div className={classnames(styles.item, styles.ghost)}>
          <div className={styles.contents}>
            <div className={styles.preview} />
            {layer.name}
          </div>
        </div>
      );
    },
    [layerEntitiesMapState],
  );
  const renderPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps) => <div className={styles.placeholder} style={injectedProps.style} />,
    [layerEntitiesMapState],
  );
  const renderStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps, { identifier }: StackedGroupRendererMeta<Layer["id"]>) => {
      const layer = layerEntitiesMapState.get(identifier)!;

      return (
        <div className={classnames(styles.item, styles.group, styles.stacked)} style={injectedProps.style}>
          <div className={classnames("fa", "fa-arrow-circle-right ", styles.icon, styles.arrow)} />
          <div className={classnames("fa", "fa-folder", styles.icon, styles.folder)} />
          {layer.name}
        </div>
      );
    },
    [layerEntitiesMapState],
  );

  const onDragEnd = React.useCallback(
    (meta: DragEndMeta<Layer["id"]>) => {
      if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return;

      const newMap = new Map(layerEntitiesMapState.entries());
      const layer = newMap.get(meta.identifier);
      if (layer == undefined) return;
      const group = newMap.get(meta.groupIdentifier ?? rootLayerId);
      if (group == undefined) return;
      if (group.children == undefined) return;

      if (meta.groupIdentifier === meta.nextGroupIdentifier) {
        const nextIndex = meta.nextIndex ?? group.children?.length ?? 0;
        group.children = arrayMove(group.children, meta.index, nextIndex);
      } else {
        const nextGroup = newMap.get(meta.nextGroupIdentifier ?? rootLayerId);
        if (nextGroup == undefined) return;
        if (nextGroup.children == undefined) return;

        group.children.splice(meta.index, 1);
        if (meta.nextIndex == undefined) {
          // Inserts a layer to a group which has no layers.
          nextGroup.children.push(meta.identifier);
        } else {
          // Insets a layer to a group.
          nextGroup.children.splice(meta.nextIndex, 0, layer.id);
        }
      }

      setLayerEntitiesMapState(newMap);
    },
    [layerEntitiesMapState],
  );

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navigation}>
        <div className={styles.title}>Layers</div>
      </nav>

      <List
        className={styles.list}
        renderDropLine={renderDropLineElement}
        renderGhost={renderGhostElement}
        renderPlaceholder={renderPlaceholderElement}
        renderStackedGroup={renderStackedGroupElement}
        itemSpacing={0}
        onDragEnd={onDragEnd}
      >
        {itemElements}
      </List>
    </div>
  );
};

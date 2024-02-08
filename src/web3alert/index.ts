export type Tags = string[];

export type Labels = Record<string, string>;

export type Project = {
  id: string;
  name: string;
  fullname: string;
  workspace: string;
  public: boolean;
  tags: Tags;
  labels: Labels;
  meta: ProjectMeta;
};

export type ProjectMeta = {
  title: string;
  description: string;
  icon?: string;
  avatar?: string;
  cover?: string;
};

export type ProjectSource = {
  name: string;
  public: boolean;
  tags?: Tags;
  labels?: Labels;
  meta: ProjectMeta;
};

export type ProjectSaveParams = {
  name: string;
  fullname: string;
  workspace: string;
  public: boolean;
  tags?: Tags;
  labels?: Labels;
  meta: ProjectMeta;
};

export type App = {
  id: string;
  name: string;
  fullname: string;
  project: string;
  workspace: string;
  public: boolean;
  url: string;
  tags: Tags;
  labels: Labels;
};

export type AppSource = {
  name: string;
  url: string;
  blueprints: BlueprintSource[];
  tags?: Tags;
  labels?: Labels;
};

export type AppSaveParams = {
  name: string;
  fullname: string;
  project: string;
  workspace: string;
  url: string;
  tags?: Tags;
  labels?: Labels;
};

export type Blueprint = {
  id: string;
  name: string;
  fullname: string;
  app: string;
  project: string;
  workspace: string;
  public: boolean;
  type: string;
  tags: Tags;
  labels: Labels;
  meta?: BlueprintMeta;
};

export type BlueprintMeta = {
  title?: string;
  description?: string;
};

export type BlueprintSource = {
  name: string;
  type: string;
  tags?: Tags;
  labels?: Labels;
  meta?: BlueprintMeta;
};

export type BlueprintSaveParams = {
  name: string;
  fullname: string;
  app: string;
  project: string;
  workspace: string;
  type: string;
  tags?: Tags;
  labels?: Labels;
  meta?: BlueprintMeta;
};

export type Resource = {
  id: string;
  name: string;
  fullname: string;
  project?: string;
  workspace: string;
  public: boolean;
  blueprint: string;
  data?: object | null;
  tags: Tags;
  labels: Labels;
  meta?: ResourceMeta;
};

export type ResourceMeta = {
  title?: string;
};

export type ResourceSource = {
  name: string;
  blueprint: string;
  data: object | null;
  tags?: Tags;
  labels?: Labels;
  meta?: ResourceMeta;
};

export type ResourceSaveParams = {
  name: string;
  fullname: string;
  project?: string;
  workspace: string;
  blueprint: string;
  data: object | null;
  tags?: Tags;
  labels?: Labels;
  meta?: ResourceMeta;
};

export type Trigger = {
  id: string;
  name: string;
  fullname: string;
  project: string;
  workspace: string;
  public: boolean;
  values: Record<string, unknown>;
  pipeline: TriggerPipeline;
  tags: Tags;
  labels: Labels;
  meta: TriggerMeta;
};

export type TriggerPipeline = {
  output: string;
  nodes: object[];
  test: TriggerPipelineTest;
};

export type TriggerPipelineTest = {
  values: object;
  samples: object[];
};

export type TriggerMeta = {
  title: string;
  description?: string;
};

export type TriggerSource = {
  name: string;
  values: Record<string, unknown>;
  pipeline: TriggerPipeline;
  tags?: Tags;
  labels?: Labels;
  meta: TriggerMeta;
};

export type TriggerSaveParams = {
  name: string;
  fullname: string;
  project: string;
  workspace: string;
  values: Record<string, unknown>;
  pipeline: TriggerPipeline;
  tags?: Tags;
  labels?: Labels;
  meta: TriggerMeta;
};

export type EngineRunPipelineParams = {
  source: {
    name: string;
    nodes: object[];
  };
  values?: object;
  samples: object[];
};

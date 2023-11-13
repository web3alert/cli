export type Labels = Record<string, string>;

export type Me = {
  id: string;
};

export type Project = {
  id: string;
  name: string;
  fullname: string;
  workspace: string;
  public: boolean;
  meta: ProjectMeta;
};

export type ProjectMeta = {
  title: string;
  description: string;
};

export type ProjectSource = {
  name: string;
  public: boolean;
  meta: ProjectMeta;
};

export type ProjectSaveParams = {
  name: string;
  fullname: string;
  workspace: string;
  public: boolean;
  meta: ProjectMeta;
};

export type Resource = {
  id: string;
  name: string;
  fullname: string;
  project?: string;
  workspace: string;
  public: boolean;
  blueprint: string;
  data: object;
};

export type ResourceSource = {
  name: string;
  blueprint: string;
  data: object;
};

export type ResourceSaveParams = {
  name: string;
  fullname: string;
  project?: string;
  workspace: string;
  blueprint: string;
  data: object;
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
  labels: Labels;
  meta: TriggerMeta;
};

export type TriggerSaveParams = {
  name: string;
  fullname: string;
  project: string;
  workspace: string;
  values: Record<string, unknown>;
  pipeline: TriggerPipeline;
  labels: Labels;
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

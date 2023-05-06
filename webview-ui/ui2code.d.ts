import { SandpackPredefinedTemplate, SandboxEnvironment } from "sandpack-vue3";

declare global {
  var beautifier: any;

  type UiType =
    | "input"
    | "textarea"
    | "radio"
    | "checkbox"
    | "button"
    | "switch"
    | "select"
    | "timepicker"
    | "datepicker"
    | "timerange"
    | "daterange"
    | "row"
    | "table"
    | "default";

  type CompItemConf = {
    label: string;
    showLabel?: boolean;
    tag?: string;
    defaultValue?: any;
    required?: boolean;
    layout?: "colItem" | "rowItem" | "raw";
    [propName: string]: any;
  };

  interface OptionItem {
    label: string;
    value: string | number;
  }

  interface CompItemSlot {
    options?: OptionItem[];
    default?: string;
    [propName: string]: any;
  }

  interface ComponentItemJson {
    type: UiType;
    __config__: CompItemConf;
    __slot__?: CompItemSlot;
    placeholder?: string;
    readonly?: boolean;
    disabled?: boolean;
    children?: ComponentItemJson[]
    [propName: string]: any;
  }

  interface DetectItem {
    x: number;
    y: number;
    w: number;
    h: number;
    prob: number;
    class: UiType;
  }

  type TextRegion = [[number, number], [number, number], [number, number], [number, number]];

  interface TextItem {
    confidence: number;
    text: string;
    text_region: TextRegion;
    x?: number;
    y?: number;
  }

  type structureTable = {
    cell_bbox: Array<Array<number>>,
    html: string
  }

  interface StructureItem {
    type: string;
    res: structureTable;
    bbox: XYXY;
    [key: string]: any;
  }

  interface DesignJson {
    fields: ComponentItemJson[];
  }

  type PointXY = {
    x: number;
    y: number;
  };

  type XYXY = [number, number, number, number];

  type OptionItem = {
    value: number;
    label: string;
  };

  type NumberKey<T> = { [key: number]: T };

  interface FormConfig {
    formRef: string;
    formModel: string;
    size: string;
    labelPosition: string;
    labelWidth: number;
    formRules: string;
    gutter: number;
    disabled: boolean;
    span: number;
    formBtns: boolean;
  }

  interface FormConf extends FormConfig {
    fields: ComponentItemJson[];
  }

  interface IFiles {
    [key: string]: {
      content?: string;
      code?: string;
      isBinary: boolean;
    };
  }

  interface SandboxTemplateConfig {
    files: IFiles;
    main: string;
    template: SandpackPredefinedTemplate;
    environment: SandboxEnvironment;
  }
}

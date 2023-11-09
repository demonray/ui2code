import { SandpackPredefinedTemplate, SandboxEnvironment, SandpackFiles } from "sandpack-vue3";
import { ElForm } from "element-plus"
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
    | "table"
    | "pagination"
    | "dialog"
    | "row"
    | "menu"
    | 'tabs'
    | "default"
    | "progress";

  type CompItemConf = {
    label: string;
    showLabel?: boolean;
    tag: string;
    defaultValue?: any;
    required?: boolean;
    layout?: "colItem" | "rowItem" | "raw";
    [propName: string]: any;
  };

  interface OptionItem {
    label: string;
    value: string | number;
    children?: OptionItem[];
    childrenComponet?: ComponentItemJson[]
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
    [propName: string]: any;
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
    metaInfo: any
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
    size: ElForm.size;
    labelPosition: ElForm.labelPosition;
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

  interface SandboxTemplateConfig {
    files: SandpackFiles;
    main: string;
    template: SandpackPredefinedTemplate;
    environment: SandboxEnvironment;
  }
  interface MakeHtmlResult {
    html: string;
    info: {
      usedComponents: string[]
      [index:string]: any
    }
  }
}

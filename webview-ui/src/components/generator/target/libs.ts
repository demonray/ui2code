import generateElementPlus from "./element-plus";

export type LibType = 'element-plus'


type GenerateLibMap = {
    [propName in LibType]: (data: FormConf, type: string) => string;
};

const map:GenerateLibMap = {
    "element-plus": generateElementPlus,
  };

export default map

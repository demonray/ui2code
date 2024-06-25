<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
          <el-form-item v-if="activeData.__config__.changeTag" label="组件类型">
            <el-select
              v-model="activeData.__config__.tagIcon"
              placeholder="请选择组件类型"
              :style="{ width: '100%' }"
              @change="tagChange"
            >
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.__config__.label"
                  :label="item.__config__.label"
                  :value="item.__config__.tagIcon"
                >
                  <svg-icon class="node-icon" :icon-class="item.__config__.tagIcon" />
                  <span> {{ item.__config__.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.__vModel__ !== undefined" label="字段名">
            <el-input v-model="activeData.__vModel__" placeholder="请输入字段名（v-model）" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.componentName !== undefined" label="组件名">
            {{ activeData.__config__.componentName }}
          </el-form-item>
          <el-form-item v-if="activeData.__config__.label !== undefined" label="标题">
            <el-input v-model="activeData.__config__.label" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder !== undefined" label="占位提示">
            <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.span !== undefined" label="表单栅格">
            <el-slider
              v-model="activeData.__config__.span"
              :max="24"
              :min="1"
              :marks="{ 12: '' }"
              @change="spanChange"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.layout === 'rowItem' && activeData.gutter !== undefined"
            label="栅格间隔"
          >
            <el-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.layout === 'rowItem' && activeData.layoutType !== undefined"
            label="布局模式"
          >
            <el-radio-group v-model="activeData.layoutType">
              <el-radio-button label="default" />
              <el-radio-button label="flex" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.justify !== undefined && activeData.layoutType === 'flex'"
            label="水平排列"
          >
            <el-select
              v-model="activeData.justify"
              placeholder="请选择水平排列"
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeData.align !== undefined && activeData.layoutType === 'flex'"
            label="垂直排列"
          >
            <el-radio-group v-model="activeData.align">
              <el-radio-button label="top" />
              <el-radio-button label="middle" />
              <el-radio-button label="bottom" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.labelWidth !== undefined" label="标签宽度">
            <el-input
              v-model.number="activeData.__config__.labelWidth"
              type="number"
              placeholder="请输入标签宽度"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.style && activeData.style.width !== undefined"
            label="组件宽度"
          >
            <el-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.__vModel__ !== undefined" label="默认值">
            <el-input
              :value="setDefaultValue(activeData.__config__.defaultValue)"
              placeholder="请输入默认值"
              @input="onDefaultValueInput"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-checkbox-group'" label="至少应选">
            <el-input-number
              :value="activeData.min"
              :min="0"
              placeholder="至少应选"
              @input="(v:number | null | undefined) => (activeData.min = v ? v : undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-checkbox-group'" label="最多可选">
            <el-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最多可选"
              @input="(v:number | null | undefined) => (activeData.max = v ? v : undefined)"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.__slot__ && activeData.__slot__.prepend !== undefined"
            label="前缀"
          >
            <el-input v-model="activeData.__slot__.prepend" placeholder="请输入前缀" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__slot__ && activeData.__slot__.append !== undefined"
            label="后缀"
          >
            <el-input v-model="activeData.__slot__.append" placeholder="请输入后缀" />
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon'] !== undefined" label="前图标">
            <el-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="后图标">
            <el-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="activeData['icon'] !== undefined && activeData.__config__.tag === 'el-button'"
            label="按钮图标"
          >
            <el-input v-model="activeData['icon']" placeholder="请输入按钮图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="选项分隔符">
            <el-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="最小行数">
            <el-input-number
              v-model="activeData.autosize.minRows"
              :min="1"
              placeholder="最小行数"
            />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="最大行数">
            <el-input-number
              v-model="activeData.autosize.maxRows"
              :min="1"
              placeholder="最大行数"
            />
          </el-form-item>

          <el-form-item v-if="activeData.height !== undefined" label="组件高度">
            <el-input-number v-model="activeData.height" placeholder="高度" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="精度">
            <el-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="按钮位置">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label=""> 默认 </el-radio-button>
              <el-radio-button label="right"> 右侧 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
            <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template slot="append"> 个字符 </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['active-text'] !== undefined" label="开启提示">
            <el-input v-model="activeData['active-text']" placeholder="请输入开启提示" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" label="关闭提示">
            <el-input v-model="activeData['inactive-text']" placeholder="请输入关闭提示" />
          </el-form-item>
          <el-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="请输入开启值"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="请输入关闭值"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && 'el-date-picker' === activeData.__config__.tag"
            label="时间类型"
          >
            <el-select
              v-model="activeData.type"
              placeholder="请选择时间类型"
              :style="{ width: '100%' }"
              @change="dateTypeChange"
            >
              <el-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.name !== undefined" label="文件字段名">
            <el-input v-model="activeData.name" placeholder="请输入上传文件字段名" />
          </el-form-item>
          <el-form-item v-if="activeData.accept !== undefined" label="文件类型">
            <el-select
              v-model="activeData.accept"
              placeholder="请选择文件类型"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option label="图片" value="image/*" />
              <el-option label="视频" value="video/*" />
              <el-option label="音频" value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.fileSize !== undefined" label="文件大小">
            <el-input v-model.number="activeData.__config__.fileSize" placeholder="请输入文件大小">
              <el-select
                slot="append"
                v-model="activeData.__config__.sizeUnit"
                :style="{ width: '66px' }"
              >
                <el-option label="KB" value="KB" />
                <el-option label="MB" value="MB" />
                <el-option label="GB" value="GB" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.action !== undefined" label="上传地址">
            <el-input v-model="activeData.action" placeholder="请输入上传地址" clearable />
          </el-form-item>
          <el-form-item v-if="activeData['list-type'] !== undefined" label="列表类型">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button label="text"> text </el-radio-button>
              <el-radio-button label="picture"> picture </el-radio-button>
              <el-radio-button label="picture-card"> picture-card </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && activeData.__config__.tag === 'el-button'"
            label="按钮类型"
          >
            <el-select v-model="activeData.__config__.type" :style="{ width: '100%' }">
              <el-option label="primary" value="primary" />
              <el-option label="success" value="success" />
              <el-option label="warning" value="warning" />
              <el-option label="danger" value="danger" />
              <el-option label="info" value="info" />
              <el-option label="text" value="text" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="按钮文字"
          >
            <el-input v-model="activeData.__config__.buttonText" placeholder="请输入按钮文字" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.tag === 'el-button' && activeData.__slot__"
            label="按钮文字"
          >
            <el-input v-model="activeData.__slot__.default" placeholder="请输入按钮文字" />
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
            <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
            <el-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="请输入时间段"
            />
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" label="时间格式">
            <el-input
              :value="activeData.format"
              placeholder="请输入时间格式"
              @input="setTimeValue($event)"
            />
          </el-form-item>
          <template
            v-if="
              ['el-checkbox-group', 'el-radio-group', 'el-select', 'el-menu', 'el-tabs', 'el-steps'].indexOf(
                activeData.__config__.tag || ''
              ) > -1 && activeData.__slot__
            "
          >
            <el-divider>选项</el-divider>
            <draggable
              :list="activeData.__slot__.options"
              :animation="340"
              item-key="guid"
              group="selectItem"
              handle=".option-drag"
            >
            <template #item="{ element, index }">
              <div
                class="select-item"
              >
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation" />
                </div>
                <el-input v-model="element.label" placeholder="选项名" size="small" />
                <el-input
                  placeholder="选项值"
                  size="small"
                  v-model="element.value"
                  @input="setOptionValue(element, $event)"
                />
                <div
                  class="close-btn select-line-icon"
                  @click="
                    activeData.__slot__ &&
                      activeData.__slot__.options &&
                      activeData.__slot__.options.splice(index, 1)
                  "
                >
                  <svg-icon name="delete" />
                </div>
              </div>
            </template>
            </draggable>
            <div style="margin-left: 20px">
              <el-button style="padding-bottom: 0" type="text" @click="addSelectItem">
                <svg-icon name="circleplus" />
                添加选项
              </el-button>
            </div>
            <el-divider />
          </template>

          <el-form-item v-if="activeData.__config__.optionType !== undefined" label="选项样式">
            <el-radio-group v-model="activeData.__config__.optionType">
              <el-radio-button label="default"> 默认 </el-radio-button>
              <el-radio-button label="button"> 按钮 </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="
              activeData.__config__.showLabel !== undefined &&
              activeData.__config__.labelWidth !== undefined
            "
            label="显示标签"
          >
            <el-switch v-model="activeData.__config__.showLabel" />
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" label="范围选择">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.border !== undefined" label="是否带边框">
            <el-switch v-model="activeData.__config__.border" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.dynamic !== undefined" label="动态数据">
            <el-switch v-model="activeData.__config__.dynamic" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.dynamic && activeData.__config__.url !== undefined"
            label="接口URL"
          >
            <el-input v-model="activeData.__config__.url" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.pagination !== undefined" label="分页类型">
            <el-select
              slot="append"
              v-model="activeData.__config__.pagination"
              :style="{ width: '100px' }"
              @change="pageChange"
            >
              <el-option label="不分页" value="none" />
              <el-option label="前端分页" value="local" />
              <el-option label="后端分页" value="remote" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.size !== undefined" label="组件尺寸">
            <el-radio-group v-if="activeData.type !== 'rate'" v-model="activeData.size">
              <el-radio-button label="medium"> 中等 </el-radio-button>
              <el-radio-button label="small"> 较小 </el-radio-button>
              <el-radio-button label="mini"> 迷你 </el-radio-button>
            </el-radio-group>
            <el-radio-group v-if="activeData.type === 'rate'" v-model="activeData.size">
              <el-radio-button label="small"> 较小 </el-radio-button>
              <el-radio-button label="default"> 中等 </el-radio-button>
              <el-radio-button label="large"> 较大 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.type === 'pagination'" label="分页属性">
            <el-checkbox-group v-model="activeData.__config__.layoutItems">
              <el-checkbox key="total" label="total"> total </el-checkbox>
              <el-checkbox key="sizes" label="sizes"> sizes </el-checkbox>
              <el-checkbox key="jumper" label="jumper"> jumper </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>

          <el-form-item v-if="activeData.clearable !== undefined" label="能否清空">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.showTip !== undefined" label="显示提示">
            <el-switch v-model="activeData.__config__.showTip" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="能否搜索">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="是否多选">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
            <el-switch v-model="activeData.__config__.required" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.editable !== undefined" label="是否可编辑">
            <el-switch v-model="activeData.__config__.editable" />
          </el-form-item>
          <el-form-item v-if="activeData.percentage !== undefined" label="进度值">
            <el-input v-model="activeData.percentage" placeholder="请输入进度值" />
          </el-form-item>
          <el-form-item v-if="activeData.strokeWidth !== undefined" label="进度条宽度">
            <el-input v-model="activeData.strokeWidth" placeholder="请输入进度条宽度" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-progress' && activeData.__slot__" label="文字">
            <el-input v-model="activeData.__slot__.default" placeholder="请输入文字" />
          </el-form-item>
          <el-form-item v-if="activeData.type !== undefined && activeData.__config__.tag === 'el-progress'" label="展示类型">
            <el-radio-group v-model="activeData.__config__.type">
              <el-radio-button label="dashboard">dashboard</el-radio-button>
              <el-radio-button label="circle">环状 </el-radio-button>
              <el-radio-button label="line"> 默认 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-tabs' && activeData.__config__.type !== undefined" label="展示类型">
            <el-radio-group v-model="activeData.__config__.type">
              <el-radio-button label="card"> 卡片 </el-radio-button>
              <el-radio-button label="line"> 默认 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.status !== undefined" label="状态">
            <el-radio-group v-model="activeData.status">
              <el-radio-button label="success">success </el-radio-button>
              <el-radio-button label="exception">exception </el-radio-button>
              <el-radio-button label="warning">warning </el-radio-button>
              <el-radio-button label=""> 无 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.showText !== undefined"
            label="是否展示进度"
          >
            <el-switch v-model="activeData.__config__.showLabel" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.mode !== undefined" label="展示方向">
            <el-radio-group v-model="activeData.__config__.mode">
              <el-radio-button label="horizontal"> 水平</el-radio-button>
              <el-radio-button label="vertical"> 垂直 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.position !== undefined" label="所在位置">
            <el-radio-group v-model="activeData.__config__.position">
              <el-radio-button label="top"> top</el-radio-button>
              <el-radio-button label="right"> right </el-radio-button>
              <el-radio-button label="bottom"> bottom </el-radio-button>
              <el-radio-button label="left"> left </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- <template v-if="activeData.__config__.layoutTree">
            <el-divider>布局结构树</el-divider>
            <el-tree
              :data="[activeData.__config__]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon
                    class="node-icon"
                    :icon-class="data.__config__ ? data.__config__.tagIcon : data.tagIcon"
                  />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </template> -->
          <template v-if="activeData.__config__.tag === 'el-alert'">
            <el-form-item label="提示内容">
              <el-input v-model="activeData.title" placeholder="请输入文字" />
            </el-form-item>
            <el-form-item label="描述性文字">
              <el-input v-model="activeData.description" placeholder="请输入文字" />
            </el-form-item>
            <el-form-item label="提示类型">
              <el-select v-model="activeData.__config__.type" :style="{ width: '100%' }">
                <el-option label="success" value="success" />
                <el-option label="warning" value="warning" />
                <el-option label="info" value="info" />
                <el-option label="error" value="error" />
              </el-select>
            </el-form-item>
            <el-form-item label="主题">
              <el-radio-group v-model="activeData.effect" size="small">
                <el-radio-button label="light">浅色</el-radio-button>
                <el-radio-button label="dark">深色</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否居中">
              <el-switch v-model="activeData.center" />
            </el-form-item>
            <el-form-item label="是否可关闭">
              <el-switch v-model="activeData.closable" />
            </el-form-item>
            <el-form-item label="显示图标">
              <el-switch v-model="activeData['show-icon']" />
            </el-form-item>
          </template>
          <template v-if="activeData.__config__.tag === 'el-rate'">
            <el-form-item label="最大分值">
              <el-input-number v-model="activeData.max"></el-input-number>
            </el-form-item>
            <el-form-item label="允许半选">
              <el-switch v-model="activeData['allow-half']" />
            </el-form-item>
            <el-form-item label="辅助文字">
              <el-switch v-model="activeData['show-text']" />
            </el-form-item>
          </template>
          <template v-if="activeData.type === 'tooltip'">
            <el-form-item label="提示位置">
              <el-select v-model="activeData.placement" placeholder="请选择提示位置">
                <el-option
                  v-for="item in placementOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="提示内容">
                <el-input v-model="activeData.content" placeholder="请输入文字"></el-input>
            </el-form-item>
            <el-form-item label="提示模式">
              <el-radio-group v-model="activeData.mode" size="small">
                <el-radio-button label="text">text</el-radio-button>
                <el-radio-button label="confirm">confirm</el-radio-button>
                <el-radio-button label="popover">popover</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="触发方式">
              <el-radio-group v-model="activeData.trigger" size="small">
                <el-radio-button label="click">click</el-radio-button>
                <el-radio-button label="hover">hover</el-radio-button>
                <el-radio-button label="focus">focus</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-if="Array.isArray(activeData.__config__.regList)">
            <el-divider>正则校验</el-divider>
            <div
              v-for="(item, index) in activeData.__config__.regList"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="表达式">
                <el-input v-model="item.pattern" placeholder="请输入正则" />
              </el-form-item>
              <el-form-item label="错误提示" style="margin-bottom: 0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button type="text" @click="addReg">
                <svg-icon name="circleplus" />
                添加规则
              </el-button>
            </div>
          </template>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="表单名">
            <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
          </el-form-item>
          <el-form-item label="表单模型">
            <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item>
          <el-form-item label="表单尺寸">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium"> 中等 </el-radio-button>
              <el-radio-button label="small"> 较小 </el-radio-button>
              <el-radio-button label="mini"> 迷你 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left"> 左对齐 </el-radio-button>
              <el-radio-button label="right"> 右对齐 </el-radio-button>
              <el-radio-button label="top"> 顶部对齐 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input
              v-model.number="formConf.labelWidth"
              type="number"
              placeholder="请输入标签宽度"
            />
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item label="禁用表单">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="表单按钮">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <!-- <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { isNumberStr } from "./utilities/index";
import { inputComponents, selectComponents, layoutComponents } from "./config/componentType";

const dateTimeFormat = {
  date: "yyyy-MM-dd",
  week: "yyyy 第 WW 周",
  month: "yyyy-MM",
  year: "yyyy",
  datetime: "yyyy-MM-dd HH:mm:ss",
  daterange: "yyyy-MM-dd",
  monthrange: "yyyy-MM",
  datetimerange: "yyyy-MM-dd HH:mm:ss",
};

interface Props {
  showField: boolean;
  activeData: ComponentItemJson;
  formConf: FormConfig;
}
const props = defineProps<Props>();

const emit = defineEmits(["tagChange"]);

const dateTypeOptions = [
  {
    label: "日(date)",
    value: "date",
  },
  {
    label: "周(week)",
    value: "week",
  },
  {
    label: "月(month)",
    value: "month",
  },
  {
    label: "年(year)",
    value: "year",
  },
  {
    label: "日期时间(datetime)",
    value: "datetime",
  },
];
const dateRangeTypeOptions = [
  {
    label: "日期范围(daterange)",
    value: "daterange",
  },
  {
    label: "月范围(monthrange)",
    value: "monthrange",
  },
  {
    label: "日期时间范围(datetimerange)",
    value: "datetimerange",
  },
];
const justifyOptions = [
  {
    label: "start",
    value: "start",
  },
  {
    label: "end",
    value: "end",
  },
  {
    label: "center",
    value: "center",
  },
  {
    label: "space-around",
    value: "space-around",
  },
  {
    label: "space-between",
    value: "space-between",
  },
];
const currentTab = ref("field");
const iconsVisible = ref(false);
const currentIconModel = ref("prefix-icon");

// const layoutTreeProps = {
//   label(data, node) {
//     const config = data.__config__;
//     return data.componentName || `${config.label}: ${data.__vModel__}`;
//   },
// };

watch(props.formConf, (v) => {
  // saveFormConf(v);
});

const dateOptions = computed(() => {
  if (props.activeData.type !== undefined && props.activeData.__config__.tag === "el-date-picker") {
    if (props.activeData["start-placeholder"] === undefined) {
      return dateTypeOptions;
    }
    return dateRangeTypeOptions;
  }
  return [];
});

const tagList = [
  {
    label: "输入型组件",
    options: inputComponents,
  },
  {
    label: "选择型组件",
    options: selectComponents,
  },
];

const placementOptions = [
  { label: "top", value: "top" },
  { label: "top-start", value: "top-start" },
  { label: "top-end", value: "top-end" },
  { label: "bottom", value: "bottom" },
  { label: "bottom-start", value: "bottom-start" },
  { label: "bottom-end", value: "bottom-end" },
  { label: "left", value: "left" },
  { label: "left-start", value: "left-start" },
  { label: "left-end", value: "left-end" },
  { label: "right", value: "right" },
  { label: "right-start", value: "right-start" },
  { label: "right-end", value: "right-end" },
];

function addReg() {
  props.activeData.__config__.regList.push({
    pattern: "",
    message: "",
  });
}

function addSelectItem() {
  props.activeData?.__slot__?.options?.push({
    label: "",
    value: "",
    children: []
  });
}

function setOptionValue(item: OptionItem, val: string | number) {
  item.value = isNumberStr(val as string) ? +val : val;
}

function setDefaultValue(val: any) {
  if (Array.isArray(val)) {
    return val.join(",");
  }
  if (typeof val === "boolean") {
    return `${val}`;
  }
  return val;
}

function onDefaultValueInput(str: string) {
  if (Array.isArray(props.activeData.__config__.defaultValue)) {
    // 数组
    props.activeData.__config__.defaultValue = str
      .split(",")
      .map((val) => (isNumberStr(val) ? +val : val));
  } else if (["true", "false"].indexOf(str) > -1) {
    // 布尔
    props.activeData.__config__.defaultValue = JSON.parse(str);
  } else {
    // 字符串和数字
    props.activeData.__config__.defaultValue = isNumberStr(str) ? +str : str;
  }
}

function onSwitchValueInput(val: any, name: string) {
  if (["true", "false"].indexOf(val) > -1) {
    props.activeData[name] = JSON.parse(val);
  } else {
    props.activeData[name] = isNumberStr(val) ? +val : val;
  }
}

function setTimeValue(val: string, type?: string) {
  const valueFormat = type === "week" ? dateTimeFormat.date : val;
  props.activeData.__config__.defaultValue = null;
  props.activeData["value-format"] = valueFormat;
  props.activeData.format = val;
}

function spanChange(val: number | number[]) {
  props.formConf.span = val as number;
}

function multipleChange(val: string | number | boolean) {
  props.activeData.__config__.defaultValue = val ? [] : "";
}

function dateTypeChange(val: keyof typeof dateTimeFormat) {
  setTimeValue(dateTimeFormat[val], val);
}

function rangeChange(val: string | number | boolean) {
  props.activeData.__config__.defaultValue = val
    ? [props.activeData.min, props.activeData.max]
    : props.activeData.min;
}

function openIconsDialog(model: string) {
  iconsVisible.value = true;
  currentIconModel.value = model;
}

function setIcon(val: string) {
  props.activeData[currentIconModel.value] = val;
}

function tagChange(tagIcon: string) {
  let target = inputComponents.find((item) => item.__config__.tagIcon === tagIcon);
  if (!target) target = selectComponents.find((item) => item.__config__.tagIcon === tagIcon);
  emit("tagChange", target);
}
function pageChange(type: string) {
  const target = layoutComponents.find((it) => it.type === "pagination");
  emit("tagChange", target, type === "none" ? "del-pagination" : "add-pagination");
}
</script>

<style lang="scss" scoped>
.right-board {

  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }

  .el-scrollbar {
    height: 100%;
  }
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  ::v-deep .el-icon-time {
    display: none;
  }
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}
</style>

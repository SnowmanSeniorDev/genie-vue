import Chart from './chart/Main.vue'
import GoogleMapLoader from './google-map-loader/Main.vue'
import Highlight from './highlight/Main.vue'
import Litepicker from './litepicker/Main.vue'
import Tippy from './tippy/Main.vue'
import TippyContent from './tippy-content/Main.vue'
import TailSelect from './tail-select/Main.vue'
import LoadingIcon from './loading-icon/Main.vue'
import TinySlider from './tiny-slider/Main.vue'
import CKEditor from './ckeditor/Main.vue'
import FullCalendar from './calendar/Main.vue'
import FullCalendarDraggable from './calendar/Draggable.vue'
import * as featherIcons from '@zhuowenli/vue-feather-icons'
import ArrayInput from './arrayInput/Main.vue'
import JsonEditor from './jsonEditor/Main.vue'
import { Calendar, DatePicker } from 'v-calendar'
import ConfirmDialog from './confirm-dialog/Main.vue'

export default app => {
  app.component('Chart', Chart)
  app.component('GoogleMapLoader', GoogleMapLoader)
  app.component('Highlight', Highlight)
  app.component('Litepicker', Litepicker)
  app.component('Tippy', Tippy)
  app.component('TippyContent', TippyContent)
  app.component('TailSelect', TailSelect)
  app.component('LoadingIcon', LoadingIcon)
  app.component('TinySlider', TinySlider)
  app.component('CKEditor', CKEditor)
  app.component('FullCalendar', FullCalendar)
  app.component('FullCalendarDraggable', FullCalendarDraggable)
  app.component('ArrayInput', ArrayInput)
  app.component('JsonEditor', JsonEditor)
  app.component('Calendar', Calendar)
  app.component('DatePicker', DatePicker)
  app.component('ConfirmDialog', ConfirmDialog)
  for (const [key, icon] of Object.entries(featherIcons)) {
    icon.props.size.default = '24'
    app.component(key, icon)
  }
}

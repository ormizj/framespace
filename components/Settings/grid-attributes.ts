import GridCell from "~/classes/GridCell"
import SettingLabelInputCell from "./cells/setting-label-input-cell.vue"

const frameSpaceStore = useFrameSpaceStore();
const { xGridBoundary, yGridBoundary, cellHeight } = storeToRefs(frameSpaceStore);

export default  [
    new GridCell({
        id:'x-grid',
        xGrid: 7,
        yGrid: 4,
        width: 3,
        height: 1,
        component: {
            is: SettingLabelInputCell,
            props: {
                'modelValue': xGridBoundary,
                'onUpdate:modelValue': (value: string) => xGridBoundary.value = +value,
                'title': '# X-Grid:',
                'id': 'x-grid',
                'type': 'number',
            }
        }
    }),
    new GridCell({
        id: 'y-grid',
        yGrid: 5,
        xGrid: 7,
        width: 3,
        height: 1,
        component: {
            is: SettingLabelInputCell,
            props: {
                'modelValue': yGridBoundary,
                'onUpdate:modelValue': (value: string) => yGridBoundary.value = +value,
                'title': '# Y-Grid:',
                'id': 'y-grid',
                'type': 'number',
            }
        }
    }),
    new GridCell({
        id:'cell-height'
        yGrid: 6,
        xGrid: 7,
        width: 3,
        height: 1,
        component: {
            is: SettingLabelInputCell,
            props: {
                'modelValue': cellHeight,
                'onUpdate:modelValue': (value: string) => cellHeight.value = +value,
                'title': '% Cell-Height:',
                'id': 'cell-height',
                'type': 'number',
            }
        }
    })
] as GridCell[];

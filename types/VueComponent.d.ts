import type { ShallowUnwrapRef } from 'vue';
import type {
	ComponentEmit,
	ComponentExposed,
	ComponentProps,
	ComponentSlots,
	ComponentType,
} from 'vue-component-type-helpers';

interface VueComponent<T extends Component | unknown> {
	is: ShallowUnwrapRef<T>;
	props?: ComponentProps<T>;
	emits?: ComponentEmit<T>;
	exposed?: ComponentExposed<T>;
	slots?: ComponentSlots<T>;
	type?: ComponentType<T>;
	bind?: { [key: string]: string };
}

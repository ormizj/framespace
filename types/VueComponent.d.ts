import type {
	ComponentEmit,
	ComponentExposed,
	ComponentProps,
	ComponentSlots,
	ComponentType,
} from 'vue-component-type-helpers';

interface VueComponent<T extends Component> {
	is: ShallowRef<T>;
	slots?: ComponentSlots<T>;
	props?:
		| ComponentProps<T>
		| ComponentType<T>
		| ComponentEmit<T>
		| ComponentExposed<T>
		| { [key: string]: string };
}

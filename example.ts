// Helpers (Types)

type TupleNonEmpty = [ unknown, ...unknown[] ];

// Types

type TrioseHTML<AppMsg, ComponentName> =
    [ TrioseHTMLTag<AppMsg>, (
        TrioseHTML<AppMsg, ComponentName> | string
    )[] ] | ComponentName;

type TrioseHTMLTag<AppMsg> =
    string | [
        string,
        { [key: string]: (string | AppMsg) }
    ];

type TrioseComponent<
    ArgProduct extends { [key: string]: "attr_use" },
    Model extends { [Property in keyof ArgProduct]: unknown },
    AppMsg, ComponentName
> =
    [ ArgProduct, (
        _: { [Property in keyof ArgProduct]: Model[Property]}
    ) => TrioseHTML<AppMsg, ComponentName> ];

type TrioseView<AppMsg, ComponentName, ModelData> =
    Map<
        ComponentName,
        TrioseComponentPartialErasure<
            (ModelData & { [key: string]: unknown }),
            AppMsg, ComponentName
        >
    >;

type ModelName = [ "triose-model", string ];

// Types (Erasure)

type TrioseComponentPartialErasure<
    ActualModel extends { [key: string]: unknown },
    AppMsg, ComponentName
> =
    TrioseComponent<
        { [Property in keyof ActualModel]: "attr_use" },
        { [Property in keyof ActualModel]: ActualModel[Property] },
        AppMsg, ComponentName
    >;

// Types (Conversions)

function component<
    ArgProduct extends { [key: string]: "attr_use" },
    Model extends { [Property in keyof ArgProduct]: unknown },
    AppMsg, ComponentName,
    ActualModel extends Model & { [key: string]: unknown }
>(
    fully_typed: TrioseComponent<ArgProduct, Model, AppMsg, ComponentName>
): TrioseComponentPartialErasure<ActualModel, AppMsg, ComponentName> {
    return (
        fully_typed as TrioseComponentPartialErasure<ActualModel, AppMsg, ComponentName>
    );
}

// Functions

function build_html<
    ArgProduct extends { [key: string]: "attr_use" },
    Model extends { [Property in keyof ArgProduct]: unknown },
    AppMsgValueable extends [], ComponentNameValueable extends [],
    ActualModel extends Model & { [key: string]: unknown }
>(
    _msg_value: AppMsgValueable, _cname_value: ComponentNameValueable,
    component: TrioseComponent<
        ArgProduct, Model,
        AppMsgValueable & TupleNonEmpty,
        ComponentNameValueable & TupleNonEmpty
    >,
    model: ActualModel
): string {
    return "<div>TODO</div>";
}

function use(x: string[]): { [key: string]: "attr_use" } {
    return Object.fromEntries(
        x.map(item => [ item, "attr_use" ])
    );
}

// To-Do List (example)

interface TodoData {
    priority: boolean
}

type AppMsg
    = [ "add-todo", string ]
    | [ "del-todo", string ]
    | [ "sw-priority", string ]
    | [ "clear" ];

let msg_value: AppMsg | [] = []

type ComponentName
    = [ "top" ]
    | [ "entry" ]
    | [ "list" ]
    | [ "list", "item" ];

let cname_value: ComponentName | [] = [];

interface ModelData {
    list: { [key: string]: TodoData },
}

let view: TrioseView<AppMsg, ComponentName, ModelData> = new Map([
    [ [ "top" ], component([
        use([]),
        _ => [ "<div>", [ "Hello, world!" ] ]
    ])]
]);

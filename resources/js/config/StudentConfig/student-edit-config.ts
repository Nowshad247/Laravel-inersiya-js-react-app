export const studetnEditConfig = {
    ButtonLabel: "Edit ",
    title: "Add New Student",
    description: "Add new Student",
    Button: {
        id: "add-new-student-button",
        variant: "outline",
        text: "Edit",
        className: "",
    },
    Fields: [
        {
            id: 'student-name',
            key: 'name',
            name: 'name',
            label: 'Student Name',
            type: 'text',
            placeholder: 'Student Name',
            autocomplete: 'name',
            tabIndex: 1,
            autoFocus: true
        },
        {
            id: 'student-email',
            key: 'email',
            name: 'email',
            label: 'student email',
            type: 'email',
            placeholder: 'Student email',
            autocomplete: 'email',
            tabIndex: 2,
            autoFocus: false
        }
    ]

}
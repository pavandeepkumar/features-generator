# 📦 feature-generator

> A powerful CLI tool to scaffold full-featured folders for React projects using **React Hook Form**, **Zod**, **TypeScript**, and custom reusable form components.

---

## 🚀 Features

- 🔧 Auto-generates a feature module under `src/features/<feature-name>`
- 📂 Creates standard subdirectories:
  - `components`, `forms`, `schema`, `services`, `hooks`, `store`, `types`, `utils`, `pages`
- 🧠 Includes:
  - Zod schema + RHF form
  - Typed API service hooks (`useGet`, `useCreate`, `useUpdate`, `useDelete`)
  - Reusable `FormInput` component added globally under `src/components/ui`
- 🧰 Ideal for TypeScript + React + TanStack Query + Zustand + Vite-based projects

---

## 📦 Installation

### Option 1: Use via `npx`

```bash
npx feature-generator <feature-name>
Option 2: Install globally
bash
Copy
Edit
npm install -g feature-generator
feature-generator <feature-name>
🛠️ How to Use
Just run:

feature-generator user
This will generate the full feature structure under src/features/user and reusable components inside src/components/ui.

📁 Folder Structure
src/
├── features/
│   └── user/
│       ├── components/
│       │   ├── details/
│       │   ├── list/
│       │   └── mutate/
│       ├── forms/
│       │   └── action-form.tsx
│       ├── hooks/
│       │   └── use-user.ts
│       ├── pages/
│       ├── schema/
│       │   └── user.schema.ts
│       ├── services/
│       │   └── user.service.ts
│       ├── store/
│       │   └── user.store.ts
│       ├── types/
│       │   └── user.types.ts
│       ├── utils/
│       │   └── user.utils.ts
│       └── index.ts
├── components/
│   └── ui/
│       └── FormInput.tsx
🧩 Example: ActionForm

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormInput form={form} name="id" label="ID" placeholder="Enter ID" />
    <Button type="submit">Submit</Button>
  </form>
</Form>

⚙️ Requirements
Node.js >= 14

Project should use:

React + TypeScript

react-hook-form

zod + @hookform/resolvers

TailwindCSS and ShadCN

TanStack Query

Zustand (optional)

🧑‍💻 Author
Pavandeep Kumar
GitHub: @pavandeepkumar

📄 License
MIT
🔗 Links
GitHub Repository: https://github.com/pavandeepkumar/features-generator
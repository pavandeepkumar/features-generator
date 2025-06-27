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

bash
Copy
Edit
feature-generator user
This will generate the full feature structure under src/features/user and reusable components inside src/components/ui.

📁 Folder Structure
pgsql
Copy
Edit
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
tsx
Copy
Edit
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormInput form={form} name="id" label="ID" placeholder="Enter ID" />
    <Button type="submit">Submit</Button>
  </form>
</Form>
📚 Documentation (TypeDoc)
This CLI tool is fully documented with TypeDoc.

👉 View it Online
📘 https://pavandeepkumar.github.io/features-generator

📦 Generate Locally
bash
Copy
Edit
npm run docs
This will output static HTML documentation to the /docs folder.

🧪 GitHub Pages Setup
Make sure you have a typedoc.json in your root:

json
Copy
Edit
{
  "entryPoints": ["bin/generate-feature.js"],
  "out": "docs",
  "includeVersion": true,
  "name": "feature-generator",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true
}
Add a script to your package.json:

json
Copy
Edit
"scripts": {
  "docs": "typedoc"
}
Push to GitHub, then go to:

go
Copy
Edit
GitHub Repo → Settings → Pages → Source: `main` branch, `/docs` folder
Your docs will be live at:

arduino
Copy
Edit
https://<your-username>.github.io/features-generator
⚙️ Requirements
Node.js >= 14

Project should use:

React + TypeScript

react-hook-form

zod + @hookform/resolvers

TailwindCSS or ShadCN

TanStack Query

Zustand (optional)

🧑‍💻 Author
Pavandeep Kumar
GitHub: @pavandeepkumar

📄 License
MIT

yaml
Copy
Edit

---

Let me know if you want me to:
- Convert it into a `.md` file and export it
- Add badges (npm version, license, etc.)
- Or auto-generate this in your CLI tool too (e.g., create README in every feature)
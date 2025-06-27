#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// CLI args
const rawFeatureName = process.argv[2];

if (!rawFeatureName) {
    console.error('❌ Error: Please provide a feature name.\n');
    console.log('Usage: npm run feature-cli <feature-name>');
    process.exit(1);
}

// --- Utilities ---
const kebabCase = (str) =>
    str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const pascalCase = (str) =>
    str.replace(/(^\w|-\w)/g, (m) => m.replace(/-/, '').toUpperCase());

const camelCase = (str) =>
    str.charAt(0).toLowerCase() + pascalCase(str).slice(1);

const isValidFeatureName = (name) =>
    /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(name);

// --- Check validity ---
if (!isValidFeatureName(rawFeatureName)) {
    console.error('❌ Invalid feature name. Use letters, numbers and dashes only.');
    process.exit(1);
}

const featureName = kebabCase(rawFeatureName);
const FeatureName = pascalCase(featureName);
const featureNameCamel = camelCase(featureName);

const baseDir = path.join(process.cwd(), 'src', 'features', featureName);

const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created: ${dirPath}`);
    }
};

const createFile = (filePath, content = '') => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`📄 Created: ${filePath}`);
    }
};

// --- Service Template ---
const serviceContent = `import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";
import usePutData from "@/hooks/use-put-data";
import useDeleteData from "@/hooks/use-delete-data";
import { IQueryParams } from "@/types";
import { ${FeatureName} } from "../types/${featureName}.types";

/**
 * 🔍 Fetch ${featureName} list
 */
export const useGet${FeatureName} = (params?: IQueryParams) =>
  useFetchData<${FeatureName}[]>({ url: API.${featureName}.list, params });

/**
 * ➕ Create ${featureName}
 */
export const useCreate${FeatureName} = () =>
  usePostData<Partial<${FeatureName}>, any>({
    url: API.${featureName}.create,
    refetchQueries: [API.${featureName}.list],
  });

/**
 * ✏️ Update ${featureName}
 */
export const useUpdate${FeatureName} = (id: string) =>
  usePutData<Partial<${FeatureName}>, any>({
    url: \`\${API.${featureName}.update}/\${id}\`,
    refetchQueries: [API.${featureName}.list],
  });

/**
 * ❌ Delete ${featureName}
 */
export const useDelete${FeatureName} = (id: string) =>
  useDeleteData({
    url: \`\${API.${featureName}.delete}/\${id}\`,
    refetchQueries: [API.${featureName}.list],
  });
`;

// --- Create Folder Structure ---
try {
    createDirectory(baseDir);

    const folders = [
        'components/details',
        'components/list',
        'components/mutate',
        'forms',
        'schema',
        'types',
        'utils',
        'pages',
        'hooks',
        'store',
        'services',
    ];

    folders.forEach((folder) => createDirectory(path.join(baseDir, folder)));

    // --- Create Files ---
    createFile(path.join(baseDir, 'index.ts'), `// Entry point for ${featureName}\n`);

    createFile(
        path.join(baseDir, 'types', `${featureName}.types.ts`),
        `/**\n * Define types for ${featureName}\n */\nexport interface ${FeatureName} {\n  id: string;\n  // TODO: Add more fields\n}\n`
    );
    const formActionContent = `// 📝 Action form (create/edit) for ${featureName}
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ${featureName}Schema, ${FeatureName}Schema } from "../schema/${featureName}.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreate${FeatureName},
  useUpdate${FeatureName}
} from "../services/${featureName}.service";

interface ${FeatureName}ActionFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<${FeatureName}Schema>;
  id?: string;
}

export function ${FeatureName}ActionForm({
  mode,
  defaultValues = { id: "" },
  id,
}: ${FeatureName}ActionFormProps) {
  const form = useForm<${FeatureName}Schema>({
    resolver: zodResolver(${featureName}Schema),
    defaultValues,
  });

  const createMutation = useCreate${FeatureName}();
  const updateMutation = id ? useUpdate${FeatureName}(id) : null;

  const onSubmit = (data: ${FeatureName}Schema) => {
    if (mode === "edit" && updateMutation) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            mode === "edit"
              ? updateMutation?.isPending
              : createMutation.isPending
          }
        >
          {mode === "edit"
            ? updateMutation?.isPending
              ? "Updating..."
              : "Update"
            : createMutation.isPending
              ? "Creating..."
              : "Create"}
        </Button>
      </form>
    </Form>
  );
}
`;

    createFile(
        path.join(baseDir, 'forms', `${featureName}.action-form.tsx`),
        formActionContent
    );


    createFile(
        path.join(baseDir, 'schema', `${featureName}.schema.ts`),
        `// 🧾 Zod schema for ${featureName}\nimport { z } from 'zod';\n\nexport const ${featureName}Schema = z.object({\n  // TODO: Define Zod validation fields\n  id: z.string(),\n});\n\nexport type ${FeatureName}Schema = z.infer<typeof ${featureName}Schema>;`
    );


    createFile(
        path.join(baseDir, 'utils', `${featureName}.utils.ts`),
        `// 🔧 Utility functions for ${featureName}\n\nexport const transform${FeatureName} = (data: any) => {\n  // TODO: Transform logic here\n  return data;\n};`
    );

    createFile(
        path.join(baseDir, 'hooks', `use-${featureName}.ts`),
        `// 🪝 Custom hooks for ${featureName}\n\nexport const use${FeatureName}Helper = () => {\n  // TODO: Add hook logic here\n};`
    );

    createFile(
        path.join(baseDir, 'store', `${featureName}.store.ts`),
        `// 🗃️ Zustand store for ${featureName}\nimport { create } from 'zustand';\n\ninterface ${FeatureName}State {\n  // TODO: State definition\n}\n\nexport const use${FeatureName}Store = create<${FeatureName}State>(() => ({\n  // TODO: Init state\n}));`
    );

    createFile(
        path.join(baseDir, 'services', `${featureName}.service.ts`),
        serviceContent
    );

    console.log(`\n✅ Feature "${featureName}" scaffolded successfully at \`src/features/${featureName}\`\n🚀 Happy building!\n`);
} catch (error) {
    console.error('❌ Failed to create feature:', error.message);
    process.exit(1);
}

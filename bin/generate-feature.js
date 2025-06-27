#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// -------- Get feature name from CLI
const featureName = process.argv[2];

if (!featureName) {
  console.error('❌ Error: Please provide a feature name.');
  console.log('Usage: node feature-cli.js <feature-name>');
  process.exit(1);
}

const pascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const capitalizedFeature = pascalCase(featureName);

// -------- Paths
const baseDir = path.join(process.cwd(), 'src', 'features', featureName);
const uiDir = path.join(process.cwd(), 'src', 'components', 'ui');

// -------- Helpers
const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};

const createFile = (filePath, content = '') => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`📄 Created file: ${filePath}`);
  }
};

// -------- Reusable FormInput
const reusableInputs = [
  {
    name: 'FormInput.tsx',
    content: `import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface FormInputProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
}

export function FormInput({ form, name, label, placeholder }: FormInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder || \`Enter \${label}\`} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
`
  },
];

// -------- Feature Service
const serviceContent = `import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";
import usePutData from "@/hooks/use-put-data";
import useDeleteData from "@/hooks/use-delete-data";
import { IQueryParams } from "@/types";

export const useGet${capitalizedFeature} = (params?: IQueryParams) =>
  useFetchData({ url: API.${featureName}.list, params });

export const useCreate${capitalizedFeature} = () =>
  usePostData({ url: API.${featureName}.create, refetchQueries: [API.${featureName}.list] });

export const useUpdate${capitalizedFeature} = (id: string) =>
  usePutData({ url: \`\${API.${featureName}.update}/\${id}\`, refetchQueries: [API.${featureName}.list] });

export const useDelete${capitalizedFeature} = (id: string) =>
  useDeleteData({ url: \`\${API.${featureName}.delete}/\${id}\`, refetchQueries: [API.${featureName}.list] });
`;

// -------- Zod Schema
const schemaContent = `import { z } from "zod";

export const ${featureName}Schema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type ${capitalizedFeature}Schema = z.infer<typeof ${featureName}Schema>;
`;

// -------- Form
const formContent = `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ${featureName}Schema, ${capitalizedFeature}Schema } from "../schema/${featureName}.schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";

interface Props {
  defaultValues?: ${capitalizedFeature}Schema;
  onSubmitHandler?: (values: ${capitalizedFeature}Schema) => void;
}

export function ActionForm({ defaultValues, onSubmitHandler }: Props) {
  const form = useForm<${capitalizedFeature}Schema>({
    resolver: zodResolver(${featureName}Schema),
    defaultValues: defaultValues || {
      id: "",
    },
  });

  function onSubmit(values: ${capitalizedFeature}Schema) {
    if (onSubmitHandler) {
      onSubmitHandler(values);
    } else {
      console.log("Submitted values:", values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput form={form} name="id" label="ID" placeholder="Enter ID" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
`;

// -------- Create structure
try {
  createDirectory(baseDir);
  createDirectory(uiDir);

  const subDirs = ['components', 'forms', 'schema', 'types', 'utils', 'pages', 'hooks', 'store', 'services'];
  subDirs.forEach((dir) => createDirectory(path.join(baseDir, dir)));

  ['details', 'list', 'mutate'].forEach((sub) => createDirectory(path.join(baseDir, 'components', sub)));

  createFile(path.join(baseDir, 'index.ts'), '');
  createFile(path.join(baseDir, 'services', `${featureName}.service.ts`), serviceContent);
  createFile(path.join(baseDir, 'types', `${featureName}.types.ts`), '');
  createFile(path.join(baseDir, 'utils', `${featureName}.utils.ts`), '');
  createFile(path.join(baseDir, 'schema', `${featureName}.schema.ts`), schemaContent);
  createFile(path.join(baseDir, 'store', `${featureName}.store.ts`), '');
  createFile(path.join(baseDir, 'hooks', `use-${featureName}.ts`), '');
  createFile(path.join(baseDir, 'forms', `action-form.tsx`), formContent);

  reusableInputs.forEach(({ name, content }) => {
    createFile(path.join(uiDir, name), content);
  });

  console.log(`\n✅ Feature module "${featureName}" created successfully at src/features/${featureName}`);
  console.log('🚀 Happy Building with Zod, RHF, and reusable components!\n');
} catch (err) {
  console.error('❌ CLI failed:', err.message);
  process.exit(1);
}

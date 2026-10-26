import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCodeBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_code_blocks';
  info: {
    description: 'Syntax-highlighted source code with filename header';
    displayName: 'Code Block';
    icon: 'code';
  };
  attributes: {
    code: Schema.Attribute.Text & Schema.Attribute.Required;
    filename: Schema.Attribute.String;
    language: Schema.Attribute.Enumeration<
      ['typescript', 'javascript', 'json', 'yaml', 'css', 'html', 'toml']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'typescript'>;
  };
}

export interface BlocksCommandBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_command_blocks';
  info: {
    description: 'Terminal CLI command snippet';
    displayName: 'Command Block';
    icon: 'terminal';
  };
  attributes: {
    command: Schema.Attribute.Text & Schema.Attribute.Required;
    description: Schema.Attribute.String;
    shell: Schema.Attribute.Enumeration<
      ['bash', 'sh', 'powershell', 'zsh', 'cmd']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'bash'>;
  };
}

export interface BlocksDiagramImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_diagram_images';
  info: {
    description: 'Technical architecture diagram or illustration';
    displayName: 'Diagram Image';
    icon: 'picture';
  };
  attributes: {
    altText: Schema.Attribute.String & Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    description: 'Article visual hero with banner image, excerpt, and author metadata';
    displayName: 'Hero Section';
    icon: 'landscape';
  };
  attributes: {
    author: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Ajay'>;
    heroImage: Schema.Attribute.Media<'images'>;
    readMinutes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<10>;
    shortDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    topic: Schema.Attribute.Enumeration<
      ['React', 'Next.js', 'Redux', 'How-to', 'Technology']
    > &
      Schema.Attribute.DefaultTo<'How-to'>;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    description: 'Standard markdown body text, headings, and callouts';
    displayName: 'Rich Text';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface BlocksVideo extends Struct.ComponentSchema {
  collectionName: 'components_blocks_videos';
  info: {
    description: 'Embedded video tutorial (e.g., YouTube) with caption';
    displayName: 'Video Tutorial';
    icon: 'play';
  };
  attributes: {
    caption: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Video Tutorial'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    Buttons: Schema.Attribute.Component<'layout.link', true>;
    callToAction: Schema.Attribute.String & Schema.Attribute.Required;
    Images: Schema.Attribute.Media<'videos' | 'images', true>;
  };
}

export interface LayoutLink extends Struct.ComponentSchema {
  collectionName: 'components_layout_links';
  info: {
    displayName: 'Link';
    icon: 'arrowRight';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SeoSeoInformation extends Struct.ComponentSchema {
  collectionName: 'components_seo_seo_informations';
  info: {
    displayName: 'SEO Information';
    icon: 'search';
  };
  attributes: {
    SeoDescription: Schema.Attribute.Text;
    SeoTitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.code-block': BlocksCodeBlock;
      'blocks.command-block': BlocksCommandBlock;
      'blocks.diagram-image': BlocksDiagramImage;
      'blocks.hero': BlocksHero;
      'blocks.rich-text': BlocksRichText;
      'blocks.video': BlocksVideo;
      'layout.hero': LayoutHero;
      'layout.link': LayoutLink;
      'seo.seo-information': SeoSeoInformation;
    }
  }
}

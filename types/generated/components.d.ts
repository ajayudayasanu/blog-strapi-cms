import type { Schema, Struct } from '@strapi/strapi';

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
      'layout.hero': LayoutHero;
      'layout.link': LayoutLink;
      'seo.seo-information': SeoSeoInformation;
    }
  }
}

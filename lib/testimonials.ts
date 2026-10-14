export type Testimonial = {
  quote: string;
  name: string;
  project: string;
  year?: string;
};

/*
  Deliberately empty.

  Testimonials must be real and attributable. Add Jubilee Sales' own owner
  quotes here — with permission to publish — and the homepage section appears
  automatically. While this array is empty the section is hidden in production.
*/
export const TESTIMONIALS: Testimonial[] = [];

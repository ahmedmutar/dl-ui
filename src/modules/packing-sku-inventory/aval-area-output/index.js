export class Index {
    configureRouter(config, router) {
      config.map([{
          route: ["", "list"],
          moduleId: "./list",
          name: "list",
          nav: false,
          title: "List Dokumen Keluar Aval - Dyeing & Printing"
        },
        {
          route: "create",
          moduleId: "./create",
          name: "create",
          nav: false,
          title: "Create: Dokumen Keluar Aval - Dyeing & Printing"
        },
        {
          route: 'view/:id',
          moduleId: './view',
          name: 'view',
          nav: false,
          title: 'View: Dokumen Keluar Aval - Dyeing & Printing'
        },
        // {
        //   route: 'edit/:id',
        //   moduleId: './edit',
        //   name: 'edit',
        //   nav: false,
        //   title: 'Edit: Penerimaan Aval - Dyeing & Printing'
        // }
      ]);
  
      this.router = router;
    }
  }
  
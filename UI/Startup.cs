using System.IO;
using Core.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using AutoMapper;

namespace UI
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            services.AddAutoMapper();
            services.AddOptions();

            services.Configure<ApplicationOptions>(options =>
            {
                /*TODO Pull-in values From Application Settings*/
            });

            //services.AddScoped<IMapper>(sp =>)
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                //Content is exposed in development so that source maps can be retrieved during development for debugging purposes
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Content")),
                    RequestPath = new PathString("/Content"),
                    OnPrepareResponse = request =>
                    {
                    request.Context.Response.Headers["Cache-Control"] = "no-cache, no-store";
                    request.Context.Response.Headers["Pragma"] = "no-cache";
                    request.Context.Response.Headers["Expires"] = "-1";
                }
                });
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"node_modules")),
                RequestPath = new PathString("/node_modules")
            });

            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = request =>
                {
                    request.Context.Response.Headers["Cache-Control"] = "no-cache, no-store";
                    request.Context.Response.Headers["Pragma"] = "no-cache";
                    request.Context.Response.Headers["Expires"] = "-1";
                }
            });

            app.UseMvc();
        }
    }
}

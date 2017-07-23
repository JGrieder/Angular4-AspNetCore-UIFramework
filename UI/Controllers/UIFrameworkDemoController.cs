using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;



namespace UI.Controllers
{
    [Route("Demo")]
    // ReSharper disable once InconsistentNaming
    public class UIFrameworkDemoController : Controller
    {
        [Route("Index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}

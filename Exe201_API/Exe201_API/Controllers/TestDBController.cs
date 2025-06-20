using Exe201_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Exe201_API.Controllers
{
    public class TestDBController : Controller
    {
        private readonly CareUContext _context;
        public TestDBController(CareUContext context)
        {
            _context = context;
        }
        [HttpGet("getUser")]
        public IActionResult getUser()
        {
            var result = _context.Users.ToList();
            return Ok(result);
        }
    }
}

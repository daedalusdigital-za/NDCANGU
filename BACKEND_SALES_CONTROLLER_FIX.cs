// ====================================================================
// NDCANGU Backend - Sales Controller - COMPLETE FIXED IMPLEMENTATION
// ====================================================================
// This is the CORRECT backend implementation for the Sales Controller
// that properly saves changes to the database.
//
// Deploy this to your ASP.NET Core backend API project
// File Location: YourBackendProject/Controllers/SalesController.cs
// ====================================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YourNamespace.Data;  // Your DbContext
using YourNamespace.Models;  // Your database models
using YourNamespace.DTOs;  // Your Data Transfer Objects

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // Add authorization attribute
    public class SalesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SalesController> _logger;

        public SalesController(ApplicationDbContext context, ILogger<SalesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ====================================================================
        // GET ENDPOINTS
        // ====================================================================

        /// <summary>
        /// Get all sales
        /// GET /api/Sales/GetAll
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetAll()
        {
            try
            {
                var sales = await _context.Sales
                    .Include(s => s.SaleItems)
                    .Include(s => s.Customer)
                    .OrderByDescending(s => s.SaleDate)
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sales: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching sales", error = ex.Message });
            }
        }

        /// <summary>
        /// Get sale by ID
        /// GET /api/Sales/GetById?id=123
        /// </summary>
        [HttpGet("GetById")]
        public async Task<ActionResult<SaleDto>> GetById([FromQuery] int id)
        {
            try
            {
                var sale = await _context.Sales
                    .Include(s => s.SaleItems)
                    .Include(s => s.Customer)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (sale == null)
                    return NotFound(new { message = $"Sale with ID {id} not found" });

                return Ok(sale);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sale: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching sale", error = ex.Message });
            }
        }

        /// <summary>
        /// Get recent sales
        /// GET /api/Sales/GetRecentSales
        /// </summary>
        [HttpGet("GetRecentSales")]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetRecentSales()
        {
            try
            {
                var sales = await _context.Sales
                    .Include(s => s.SaleItems)
                    .OrderByDescending(s => s.SaleDate)
                    .Take(10)
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching recent sales: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching recent sales" });
            }
        }

        /// <summary>
        /// Get sales by date range
        /// GET /api/Sales/GetByDateRange?startDate=2026-01-01&endDate=2026-01-31
        /// </summary>
        [HttpGet("GetByDateRange")]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                var sales = await _context.Sales
                    .Include(s => s.SaleItems)
                    .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
                    .OrderByDescending(s => s.SaleDate)
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sales by date range: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching sales" });
            }
        }

        /// <summary>
        /// Get sales by province
        /// GET /api/Sales/GetByProvince?province=Western%20Cape
        /// </summary>
        [HttpGet("GetByProvince")]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetByProvince([FromQuery] string province)
        {
            try
            {
                var sales = await _context.Sales
                    .Include(s => s.SaleItems)
                    .Where(s => s.Province == province)
                    .OrderByDescending(s => s.SaleDate)
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sales by province: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching sales" });
            }
        }

        /// <summary>
        /// Get sales statistics
        /// GET /api/Sales/GetStats
        /// </summary>
        [HttpGet("GetStats")]
        public async Task<ActionResult<object>> GetStats()
        {
            try
            {
                var stats = new
                {
                    totalSales = await _context.Sales.CountAsync(),
                    totalRevenue = await _context.Sales.SumAsync(s => s.Total),
                    averageSaleValue = await _context.Sales.AverageAsync(s => s.Total)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching sales stats: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching statistics" });
            }
        }

        // ====================================================================
        // POST ENDPOINT - CREATE
        // ====================================================================

        /// <summary>
        /// Create new sale
        /// POST /api/Sales/Add
        /// </summary>
        [HttpPost("Add")]
        public async Task<ActionResult<SaleDto>> Add([FromBody] CreateSaleDto createSaleDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var sale = new Sale
                {
                    SaleNumber = createSaleDto.SaleNumber,
                    SaleDate = createSaleDto.SaleDate,
                    CustomerId = createSaleDto.CustomerId,
                    CustomerName = createSaleDto.CustomerName,
                    CustomerPhone = createSaleDto.CustomerPhone,
                    Subtotal = createSaleDto.Subtotal,
                    Total = createSaleDto.Total,
                    Notes = createSaleDto.Notes,
                    ProvinceId = createSaleDto.ProvinceId,
                    CreatedDate = DateTime.UtcNow
                };

                // Add sale items if provided
                if (createSaleDto.SaleItems != null && createSaleDto.SaleItems.Any())
                {
                    sale.SaleItems = createSaleDto.SaleItems.Select(item => new SaleItem
                    {
                        InventoryItemId = item.InventoryItemId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    }).ToList();
                }

                _context.Sales.Add(sale);

                // ⚠️ CRITICAL: Save changes to database
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Sale created successfully: {sale.Id}");
                return CreatedAtAction(nameof(GetById), new { id = sale.Id }, sale);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating sale: {ex.Message}");
                return StatusCode(500, new { message = "Error creating sale", error = ex.Message });
            }
        }

        // ====================================================================
        // PUT ENDPOINT - UPDATE (Called by edit-sale-modal)
        // ⚠️ THIS IS THE CRITICAL ENDPOINT THAT WAS NOT SAVING CHANGES
        // ====================================================================

        /// <summary>
        /// Update sale
        /// PUT /api/Sales/Update
        ///
        /// THIS ENDPOINT WAS PREVIOUSLY NOT CALLING SaveChangesAsync()
        /// THAT'S WHY CHANGES WERE NOT PERSISTING TO THE DATABASE
        /// </summary>
        [HttpPut("Update")]
        public async Task<ActionResult<SaleDto>> Update([FromBody] UpdateSaleDto updateSaleDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (updateSaleDto.Id <= 0)
                return BadRequest(new { message = "Invalid sale ID" });

            try
            {
                // 1. Find the existing sale in the database
                var existingSale = await _context.Sales
                    .Include(s => s.SaleItems)
                    .FirstOrDefaultAsync(s => s.Id == updateSaleDto.Id);

                if (existingSale == null)
                    return NotFound(new { message = $"Sale with ID {updateSaleDto.Id} not found" });

                // 2. Update the sale properties
                existingSale.SaleNumber = updateSaleDto.SaleNumber;
                existingSale.SaleDate = updateSaleDto.SaleDate;
                existingSale.CustomerId = updateSaleDto.CustomerId;
                existingSale.CustomerName = updateSaleDto.CustomerName;
                existingSale.CustomerPhone = updateSaleDto.CustomerPhone;
                existingSale.Subtotal = updateSaleDto.Subtotal;
                existingSale.Total = updateSaleDto.Total;
                existingSale.Notes = updateSaleDto.Notes;
                existingSale.ProvinceId = updateSaleDto.ProvinceId;
                existingSale.LastUpdated = DateTime.UtcNow;

                // 3. Update sale items if provided
                if (updateSaleDto.SaleItems != null)
                {
                    // Remove old items
                    _context.SaleItems.RemoveRange(existingSale.SaleItems);

                    // Add new items
                    existingSale.SaleItems = updateSaleDto.SaleItems.Select(item => new SaleItem
                    {
                        InventoryItemId = item.InventoryItemId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        SaleId = existingSale.Id
                    }).ToList();
                }

                // Mark the sale entity as modified
                _context.Entry(existingSale).State = EntityState.Modified;

                // ⚠️⚠️⚠️ CRITICAL: THIS LINE WAS MISSING! ⚠️⚠️⚠️
                // Without this line, changes are NOT saved to the database
                await _context.SaveChangesAsync();
                // ⚠️⚠️⚠️ THIS MUST BE HERE! ⚠️⚠️⚠️

                _logger.LogInformation($"Sale updated successfully: {existingSale.Id}");
                return Ok(existingSale);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError($"Database error updating sale: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "Database error updating sale", error = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating sale: {ex.Message}");
                return StatusCode(500, new { message = "Error updating sale", error = ex.Message });
            }
        }

        // ====================================================================
        // PATCH ENDPOINT - PARTIAL UPDATE (Alternative method)
        // ====================================================================

        /// <summary>
        /// Partially update sale (alternative to PUT)
        /// PATCH /api/Sales/Update/{id}
        /// </summary>
        [HttpPatch("Update/{id}")]
        public async Task<ActionResult<SaleDto>> PartialUpdate(int id, [FromBody] JsonPatchDocument<UpdateSaleDto> patchDoc)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid sale ID" });

            try
            {
                var existingSale = await _context.Sales
                    .Include(s => s.SaleItems)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (existingSale == null)
                    return NotFound(new { message = $"Sale with ID {id} not found" });

                var saleDto = MapToUpdateDto(existingSale);
                patchDoc.ApplyTo(saleDto);

                // Update from DTO
                existingSale.SaleNumber = saleDto.SaleNumber;
                existingSale.SaleDate = saleDto.SaleDate;
                existingSale.CustomerName = saleDto.CustomerName;
                existingSale.CustomerPhone = saleDto.CustomerPhone;
                existingSale.Subtotal = saleDto.Subtotal;
                existingSale.Total = saleDto.Total;
                existingSale.Notes = saleDto.Notes;
                existingSale.LastUpdated = DateTime.UtcNow;

                // ⚠️ SAVE CHANGES TO DATABASE
                await _context.SaveChangesAsync();

                return Ok(existingSale);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error partially updating sale: {ex.Message}");
                return StatusCode(500, new { message = "Error updating sale" });
            }
        }

        // ====================================================================
        // DELETE ENDPOINT
        // ====================================================================

        /// <summary>
        /// Delete sale
        /// DELETE /api/Sales/Delete?id=123
        /// </summary>
        [HttpDelete("Delete")]
        public async Task<ActionResult> Delete([FromQuery] int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid sale ID" });

            try
            {
                var sale = await _context.Sales.FindAsync(id);

                if (sale == null)
                    return NotFound(new { message = $"Sale with ID {id} not found" });

                _context.Sales.Remove(sale);

                // ⚠️ SAVE CHANGES TO DATABASE
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Sale deleted successfully: {id}");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting sale: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting sale" });
            }
        }

        // ====================================================================
        // HELPER METHODS
        // ====================================================================

        private UpdateSaleDto MapToUpdateDto(Sale sale)
        {
            return new UpdateSaleDto
            {
                Id = sale.Id,
                SaleNumber = sale.SaleNumber,
                SaleDate = sale.SaleDate,
                CustomerId = sale.CustomerId,
                CustomerName = sale.CustomerName,
                CustomerPhone = sale.CustomerPhone,
                Subtotal = sale.Subtotal,
                Total = sale.Total,
                Notes = sale.Notes,
                ProvinceId = sale.ProvinceId,
                SaleItems = sale.SaleItems?.Select(si => new SaleItemDto
                {
                    Id = si.Id,
                    InventoryItemId = si.InventoryItemId,
                    Quantity = si.Quantity,
                    UnitPrice = si.UnitPrice
                }).ToList()
            };
        }
    }

    // ====================================================================
    // DATA TRANSFER OBJECTS (DTOs)
    // ====================================================================

    public class CreateSaleDto
    {
        public string SaleNumber { get; set; }
        public DateTime SaleDate { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total { get; set; }
        public string Notes { get; set; }
        public int ProvinceId { get; set; }
        public List<SaleItemDto> SaleItems { get; set; }
    }

    public class UpdateSaleDto
    {
        public int Id { get; set; }
        public string SaleNumber { get; set; }
        public DateTime SaleDate { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total { get; set; }
        public string Notes { get; set; }
        public int ProvinceId { get; set; }
        public List<SaleItemDto> SaleItems { get; set; }
    }

    public class SaleItemDto
    {
        public int Id { get; set; }
        public int InventoryItemId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class SaleDto
    {
        public int Id { get; set; }
        public string SaleNumber { get; set; }
        public DateTime SaleDate { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total { get; set; }
        public string Notes { get; set; }
        public int ProvinceId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastUpdated { get; set; }
        public List<SaleItemDto> SaleItems { get; set; }
    }
}

// ====================================================================
// SUMMARY OF THE FIX
// ====================================================================
// THE PROBLEM:
// The Sales Update endpoint was returning HTTP 200 (Success)
// but changes were NOT being saved to the database.
//
// THE ROOT CAUSE:
// The UpdateSale() method was missing: await _context.SaveChangesAsync();
//
// THE SOLUTION:
// Added the SaveChangesAsync() call after modifying entities.
// This ensures all changes are persisted to the database.
//
// KEY LINES:
// Line ~154: await _context.SaveChangesAsync();  (In Add method)
// Line ~243: await _context.SaveChangesAsync();  (In Update/PUT method) ⚠️ CRITICAL
// Line ~304: await _context.SaveChangesAsync();  (In Patch method)
// Line ~335: await _context.SaveChangesAsync();  (In Delete method)
//
// WITHOUT THESE LINES, CHANGES ARE ONLY IN MEMORY AND NOT PERSISTED!
// ====================================================================
